Sub ConvertCustomerToEmployee()
    Dim dict As Object
    Dim wsSource As Worksheet, wsDest As Worksheet
    Dim dataArr As Variant
    Dim resultArr As Variant
    Dim i As Long
    Dim key As Variant ' <--- FIX: This must be Variant for "For Each" loops
    Dim colCount As Long
    Dim filePath As Variant
    Dim wbCSV As Workbook
    
    ' Optimization
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual
    
    ' 1. Select and Open the CSV file
    filePath = Application.GetOpenFilename("CSV Files (*.csv), *.csv")
    If filePath = False Then Exit Sub
    
    Set wbCSV = Workbooks.Open(filePath)
    Set wsSource = wbCSV.Sheets(1)
    
    ' 2. Load data into Memory (Array)
    Dim lastRow As Long
    lastRow = wsSource.Cells(wsSource.Rows.Count, "A").End(xlUp).Row
    
    ' Load the entire range (Assuming data starts at A2 and goes to AF)
    ' Adjust the "AF" if your CSV has more/fewer columns than the SQL schema suggests
    dataArr = wsSource.Range("A2:AF" & lastRow).Value
    
    ' Close CSV to save memory
    wbCSV.Close SaveChanges:=False
    
    ' 3. Initialize Dictionary
    Set dict = CreateObject("Scripting.Dictionary")
    
    ' 4. Loop through the data and Aggregate
    Dim tmpArr As Variant
    Dim empID As String
    
    For i = 1 To UBound(dataArr, 1)
        ' Col 16 is Employee ID (Based on SQL column order provided)
        empID = CStr(dataArr(i, 16))
        
        If Len(empID) > 0 Then
            If Not dict.Exists(empID) Then
                ' Create new entry array:
                ' 0=EmpID, 1=Name, 2=Branch, 3=Region, 4=DB_Amt, 5=Reg_Acc, 6=Reg_Amt, 
                ' 7=OD_Acc, 8=OD_Amt, 9=Tot_Acc, 10=Tot_Amt, 11=Ach_Acc, 12=Ach_Amt, 13=Port_Acc, 14=Port_Amt
                ReDim tmpArr(0 To 14)
                tmpArr(0) = empID
                tmpArr(1) = dataArr(i, 17) ' Employee Name
                tmpArr(2) = dataArr(i, 6)  ' Branch Code
                tmpArr(3) = dataArr(i, 9)  ' Region Name
                
                ' Initialize Metrics using Val() to handle NULLs safely
                tmpArr(4) = Val(dataArr(i, 19))  ' db_amount
                tmpArr(5) = Val(dataArr(i, 23))  ' regular_demand_account
                tmpArr(6) = Val(dataArr(i, 24))  ' regular_demand_amount
                tmpArr(7) = Val(dataArr(i, 25))  ' od_demand_account
                tmpArr(8) = Val(dataArr(i, 26))  ' od_demand_amount
                tmpArr(9) = Val(dataArr(i, 27))  ' total_demand_account
                tmpArr(10) = Val(dataArr(i, 28)) ' total_demand_amount
                tmpArr(11) = Val(dataArr(i, 29)) ' achievement_account
                tmpArr(12) = Val(dataArr(i, 30)) ' achievement_amount
                tmpArr(13) = Val(dataArr(i, 31)) ' portfolio_account
                tmpArr(14) = Val(dataArr(i, 32)) ' portfolio_amount
                
                dict.Add empID, tmpArr
            Else
                ' Update existing entry
                tmpArr = dict(empID)
                tmpArr(4) = tmpArr(4) + Val(dataArr(i, 19))
                tmpArr(5) = tmpArr(5) + Val(dataArr(i, 23))
                tmpArr(6) = tmpArr(6) + Val(dataArr(i, 24))
                tmpArr(7) = tmpArr(7) + Val(dataArr(i, 25))
                tmpArr(8) = tmpArr(8) + Val(dataArr(i, 26))
                tmpArr(9) = tmpArr(9) + Val(dataArr(i, 27))
                tmpArr(10) = tmpArr(10) + Val(dataArr(i, 28))
                tmpArr(11) = tmpArr(11) + Val(dataArr(i, 29))
                tmpArr(12) = tmpArr(12) + Val(dataArr(i, 30))
                tmpArr(13) = tmpArr(13) + Val(dataArr(i, 31))
                tmpArr(14) = tmpArr(14) + Val(dataArr(i, 32))
                dict(empID) = tmpArr
            End If
        End If
    Next i
    
    ' 5. Write Result to New Sheet
    Set wsDest = ThisWorkbook.Sheets.Add
    wsDest.Name = "Emp_Sum_" & Format(Now, "hhmmss")
    
    ' Headers
    Dim headers As Variant
    headers = Array("Employee ID", "Employee Name", "Branch", "Region", "DB Amount", _
                    "Reg Demand Acc", "Reg Demand Amt", "OD Demand Acc", "OD Demand Amt", _
                    "Total Demand Acc", "Total Demand Amt", "Achieve Acc", "Achieve Amt", _
                    "Portfolio Acc", "Portfolio Amt")
    
    wsDest.Range("A1").Resize(1, UBound(headers) + 1).Value = headers
    
    ' Dump Dictionary to Array for fast writing
    If dict.Count > 0 Then
        ReDim resultArr(1 To dict.Count, 1 To 15)
        i = 1
        For Each key In dict.Keys
            tmpArr = dict(key)
            For colCount = 0 To 14
                resultArr(i, colCount + 1) = tmpArr(colCount)
            Next colCount
            i = i + 1
        Next key
        
        wsDest.Range("A2").Resize(dict.Count, 15).Value = resultArr
    End If
    
    ' Format
    wsDest.Columns("A:O").AutoFit
    wsDest.Range("E:O").NumberFormat = "#,##0.00"
    
    Application.ScreenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
    MsgBox "Done! Processed " & UBound(dataArr, 1) & " rows into " & dict.Count & " employees.", vbInformation
    
End Sub