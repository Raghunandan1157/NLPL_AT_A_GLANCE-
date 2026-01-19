Option Explicit

Public Sub Convert_MasterData_To_EmployeeBasis_V2()

    Dim ws As Worksheet, outWs As Worksheet
    Dim lastRow As Long, lastCol As Long
    Dim headers As Variant, data As Variant
    Dim r As Long, i As Long
    Dim key As String

    Application.ScreenUpdating = False
    Application.EnableEvents = False
    Application.Calculation = xlCalculationManual
    Application.StatusBar = False

    On Error GoTo Fail

    Set ws = ActiveSheet  '<<< keep your data sheet active

    '---- robust last row/col (works even if column A is empty)
    If ws.Cells.Find(What:="*", LookIn:=xlFormulas, SearchOrder:=xlByRows, SearchDirection:=xlPrevious) Is Nothing Then
        MsgBox "Sheet is empty.", vbExclamation
        GoTo SafeExit
    End If

    lastRow = ws.Cells.Find(What:="*", LookIn:=xlFormulas, SearchOrder:=xlByRows, SearchDirection:=xlPrevious).Row
    lastCol = ws.Cells.Find(What:="*", LookIn:=xlFormulas, SearchOrder:=xlByColumns, SearchDirection:=xlPrevious).Column

    If lastRow < 2 Then
        MsgBox "Only header found. No data rows.", vbExclamation
        GoTo SafeExit
    End If

    MsgBox "Starting... Rows: " & (lastRow - 1) & "  Cols: " & lastCol, vbInformation

    headers = ws.Range(ws.Cells(1, 1), ws.Cells(1, lastCol)).Value
    data = ws.Range(ws.Cells(2, 1), ws.Cells(lastRow, lastCol)).Value

    '---- find needed columns by header text (case-insensitive)
    Dim colDate As Long, colMonth As Long, colYear As Long, colEmpId As Long
    colDate = FindHeaderCol(headers, "date")
    colMonth = FindHeaderCol(headers, "month")
    colYear = FindHeaderCol(headers, "year")
    colEmpId = FindHeaderCol(headers, "employee_id")

    If colDate = 0 Or colMonth = 0 Or colYear = 0 Or colEmpId = 0 Then
        MsgBox "Missing required columns in header row: date, month, year, employee_id", vbCritical
        GoTo SafeExit
    End If

    '---- optional columns
    Dim colEmpName As Long, colBranchCode As Long, colBranchName As Long, colDistrict As Long, colRegion As Long, colProduct As Long, colTimestamp As Long
    colEmpName = FindHeaderCol(headers, "employee_name")
    colBranchCode = FindHeaderCol(headers, "branch_code")
    colBranchName = FindHeaderCol(headers, "branch_name")
    colDistrict = FindHeaderCol(headers, "district_name")
    colRegion = FindHeaderCol(headers, "region_name")
    colProduct = FindHeaderCol(headers, "product_id")
    colTimestamp = FindHeaderCol(headers, "timestamp")

    '---- numeric columns
    Dim colDbAmt As Long, colRegAcc As Long, colRegAmt As Long, colOdAcc As Long, colOdAmt As Long
    Dim colTotAcc As Long, colTotAmt As Long, colAchAcc As Long, colAchAmt As Long, colPortAcc As Long, colPortAmt As Long

    colDbAmt = FindHeaderCol(headers, "db_amount")
    colRegAcc = FindHeaderCol(headers, "regular_demand_account")
    colRegAmt = FindHeaderCol(headers, "regular_demand_amount")
    colOdAcc = FindHeaderCol(headers, "od_demand_account")
    colOdAmt = FindHeaderCol(headers, "od_demand_amount")
    colTotAcc = FindHeaderCol(headers, "total_demand_account")
    colTotAmt = FindHeaderCol(headers, "total_demand_amount")
    colAchAcc = FindHeaderCol(headers, "achievement_account")
    colAchAmt = FindHeaderCol(headers, "achievement_amount")
    colPortAcc = FindHeaderCol(headers, "portfolio_account")
    colPortAmt = FindHeaderCol(headers, "portfolio_amount")

    '---- Try Dictionary (Windows), else fallback to Collection (Mac safe)
    Dim dict As Object, useDict As Boolean
    On Error Resume Next
    Set dict = CreateObject("Scripting.Dictionary")
    useDict = (Err.Number = 0)
    Err.Clear
    On Error GoTo 0
    If useDict Then dict.CompareMode = 1 'vbTextCompare

    Dim keyIndex As Collection
    If Not useDict Then Set keyIndex = New Collection

    'Each record has 22 fields
    Dim rec As Variant

    'For Collection fallback storage
    Dim recs() As Variant, cap As Long, cnt As Long, idx As Long
    If Not useDict Then
        cap = 2000
        ReDim recs(1 To cap)
        cnt = 0
    End If

    '---- main loop
    For r = 1 To UBound(data, 1)

        key = CStr(Nz(data(r, colDate))) & "|" & _
              CStr(Nz(data(r, colMonth))) & "|" & _
              CStr(Nz(data(r, colYear))) & "|" & _
              CStr(Nz(data(r, colEmpId)))

        If useDict Then
            If Not dict.Exists(key) Then
                rec = NewRec( _
                    data(r, colDate), data(r, colMonth), data(r, colYear), data(r, colEmpId), _
                    GetVal(data, r, colEmpName), GetVal(data, r, colBranchCode), GetVal(data, r, colBranchName), _
                    GetVal(data, r, colDistrict), GetVal(data, r, colRegion), GetVal(data, r, colProduct), GetVal(data, r, colTimestamp))
                dict.Add key, rec
            Else
                rec = dict(key)
            End If
        Else
            idx = 0
            On Error Resume Next
            idx = CLng(keyIndex(key))
            If Err.Number <> 0 Then idx = 0: Err.Clear
            On Error GoTo 0

            If idx = 0 Then
                cnt = cnt + 1
                If cnt > cap Then
                    cap = cap * 2
                    ReDim Preserve recs(1 To cap)
                End If
                keyIndex.Add cnt, key
                rec = NewRec( _
                    data(r, colDate), data(r, colMonth), data(r, colYear), data(r, colEmpId), _
                    GetVal(data, r, colEmpName), GetVal(data, r, colBranchCode), GetVal(data, r, colBranchName), _
                    GetVal(data, r, colDistrict), GetVal(data, r, colRegion), GetVal(data, r, colProduct), GetVal(data, r, colTimestamp))
                recs(cnt) = rec
                idx = cnt
            Else
                rec = recs(idx)
            End If
        End If

        'carry first non-empty text
        If colEmpName > 0 Then If Len(Trim$(CStr(rec(5)))) = 0 Then rec(5) = Nz(data(r, colEmpName))
        If colBranchCode > 0 Then If Len(Trim$(CStr(rec(6)))) = 0 Then rec(6) = Nz(data(r, colBranchCode))
        If colBranchName > 0 Then If Len(Trim$(CStr(rec(7)))) = 0 Then rec(7) = Nz(data(r, colBranchName))
        If colDistrict > 0 Then If Len(Trim$(CStr(rec(8)))) = 0 Then rec(8) = Nz(data(r, colDistrict))
        If colRegion > 0 Then If Len(Trim$(CStr(rec(9)))) = 0 Then rec(9) = Nz(data(r, colRegion))
        If colProduct > 0 Then If Len(Trim$(CStr(rec(10)))) = 0 Then rec(10) = Nz(data(r, colProduct))

        'latest timestamp
        If colTimestamp > 0 Then
            Dim tsNew As Variant: tsNew = Nz(data(r, colTimestamp))
            If IsDate(tsNew) And IsDate(rec(11)) Then
                If CDate(tsNew) > CDate(rec(11)) Then rec(11) = tsNew
            ElseIf Len(Trim$(CStr(rec(11)))) = 0 Then
                rec(11) = tsNew
            End If
        End If

        'SUM numbers (only if column exists)
        If colDbAmt > 0 Then rec(12) = CDbl(rec(12)) + NzNum(data(r, colDbAmt))
        If colRegAcc > 0 Then rec(13) = CLng(rec(13)) + CLng(NzNum(data(r, colRegAcc)))
        If colRegAmt > 0 Then rec(14) = CDbl(rec(14)) + NzNum(data(r, colRegAmt))
        If colOdAcc > 0 Then rec(15) = CLng(rec(15)) + CLng(NzNum(data(r, colOdAcc)))
        If colOdAmt > 0 Then rec(16) = CDbl(rec(16)) + NzNum(data(r, colOdAmt))
        If colTotAcc > 0 Then rec(17) = CLng(rec(17)) + CLng(NzNum(data(r, colTotAcc)))
        If colTotAmt > 0 Then rec(18) = CDbl(rec(18)) + NzNum(data(r, colTotAmt))
        If colAchAcc > 0 Then rec(19) = CLng(rec(19)) + CLng(NzNum(data(r, colAchAcc)))
        If colAchAmt > 0 Then rec(20) = CDbl(rec(20)) + NzNum(data(r, colAchAmt))
        If colPortAcc > 0 Then rec(21) = CLng(rec(21)) + CLng(NzNum(data(r, colPortAcc)))
        If colPortAmt > 0 Then rec(22) = CDbl(rec(22)) + NzNum(data(r, colPortAmt))

        If useDict Then
            dict(key) = rec
        Else
            recs(idx) = rec
        End If

        If r Mod 20000 = 0 Then
            Application.StatusBar = "Processing " & r & " / " & UBound(data, 1)
            DoEvents
        End If
    Next r

    '---- output sheet
    On Error Resume Next
    Set outWs = ThisWorkbook.Worksheets("employee_basis")
    On Error GoTo 0
    If outWs Is Nothing Then
        Set outWs = ThisWorkbook.Worksheets.Add(After:=ws)
        outWs.Name = "employee_basis"
    Else
        outWs.Cells.Clear
    End If

    Dim outHeaders As Variant
    outHeaders = Array( _
        "date", "month", "year", "employee_id", "employee_name", _
        "branch_code", "branch_name", "district_name", "region_name", "product_id", _
        "latest_timestamp", _
        "db_amount", _
        "regular_demand_account", "regular_demand_amount", _
        "od_demand_account", "od_demand_amount", _
        "total_demand_account", "total_demand_amount", _
        "achievement_account", "achievement_amount", _
        "portfolio_account", "portfolio_amount" _
    )

    For i = 0 To UBound(outHeaders)
        outWs.Cells(1, i + 1).Value = outHeaders(i)
    Next i

    Dim outCount As Long
    If useDict Then outCount = dict.Count Else outCount = cnt

    Dim outArr() As Variant
    ReDim outArr(1 To outCount, 1 To 22)

    Dim rowOut As Long, k As Variant
    rowOut = 0

    If useDict Then
        For Each k In dict.Keys
            rowOut = rowOut + 1
            rec = dict(k)
            For i = 1 To 22
                outArr(rowOut, i) = rec(i)
            Next i
        Next k
    Else
        For rowOut = 1 To cnt
            rec = recs(rowOut)
            For i = 1 To 22
                outArr(rowOut, i) = rec(i)
            Next i
        Next rowOut
    End If

    outWs.Range(outWs.Cells(2, 1), outWs.Cells(outCount + 1, 22)).Value = outArr
    outWs.Columns.AutoFit

    Application.StatusBar = False
    MsgBox "Done! 'employee_basis' rows: " & outCount, vbInformation

SafeExit:
    Application.StatusBar = False
    Application.ScreenUpdating = True
    Application.EnableEvents = True
    Application.Calculation = xlCalculationAutomatic
    Exit Sub

Fail:
    Application.StatusBar = False
    MsgBox "Stopped with error: " & Err.Number & " - " & Err.Description, vbCritical
    Resume SafeExit
End Sub


'================ HELPERS ================

Private Function FindHeaderCol(ByVal headers As Variant, ByVal headerName As String) As Long
    Dim c As Long, h As String
    For c = 1 To UBound(headers, 2)
        h = LCase$(Trim$(CStr(headers(1, c))))
        If h = LCase$(headerName) Then
            FindHeaderCol = c
            Exit Function
        End If
    Next c
    FindHeaderCol = 0
End Function

Private Function Nz(ByVal v As Variant) As Variant
    If IsError(v) Then Nz = "" _
    ElseIf IsEmpty(v) Or IsNull(v) Then Nz = "" _
    Else Nz = v
End Function

Private Function NzNum(ByVal v As Variant) As Double
    If IsError(v) Then NzNum = 0#
    ElseIf IsEmpty(v) Or IsNull(v) Or Trim$(CStr(v)) = "" Then NzNum = 0#
    ElseIf IsNumeric(v) Then NzNum = CDbl(v)
    Else NzNum = 0#
End Function

Private Function GetVal(ByVal data As Variant, ByVal r As Long, ByVal col As Long) As Variant
    If col > 0 Then GetVal = Nz(data(r, col)) Else GetVal = ""
End Function

Private Function NewRec( _
    ByVal vDate As Variant, ByVal vMonth As Variant, ByVal vYear As Variant, ByVal vEmpId As Variant, _
    ByVal vEmpName As Variant, ByVal vBranchCode As Variant, ByVal vBranchName As Variant, _
    ByVal vDistrict As Variant, ByVal vRegion As Variant, ByVal vProduct As Variant, ByVal vTimestamp As Variant _
) As Variant
    Dim rec(1 To 22) As Variant
    rec(1) = Nz(vDate)
    rec(2) = Nz(vMonth)
    rec(3) = Nz(vYear)
    rec(4) = Nz(vEmpId)
    rec(5) = Nz(vEmpName)
    rec(6) = Nz(vBranchCode)
    rec(7) = Nz(vBranchName)
    rec(8) = Nz(vDistrict)
    rec(9) = Nz(vRegion)
    rec(10) = Nz(vProduct)
    rec(11) = Nz(vTimestamp)

    rec(12) = 0#: rec(13) = 0&: rec(14) = 0#
    rec(15) = 0&: rec(16) = 0#: rec(17) = 0&
    rec(18) = 0#: rec(19) = 0&: rec(20) = 0#
    rec(21) = 0&: rec(22) = 0#

    NewRec = rec
End Function
