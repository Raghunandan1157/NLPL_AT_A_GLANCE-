/**
 * Data Uploader - Client-side JavaScript
 */

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const previewTable = document.getElementById('previewTable');
const uploadBtn = document.getElementById('uploadBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultSection = document.getElementById('resultSection');
const resultCard = document.getElementById('resultCard');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultStats = document.getElementById('resultStats');

// DateTime inputs
const hourInput = document.getElementById('hour');
const dateInput = document.getElementById('date');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

// State
let selectedFile = null;

// Month abbreviations
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Initialize datetime with current values
function initDateTime() {
    const now = new Date();
    hourInput.value = now.getHours();
    dateInput.value = now.getDate();
    monthInput.value = MONTHS[now.getMonth()];
    yearInput.value = now.getFullYear();
}

// Format file size
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle file selection
function handleFile(file) {
    if (!file) return;

    const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
        alert('Please upload a CSV or Excel file.');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    fileInfo.style.display = 'block';
    dropzone.style.display = 'none';
    uploadBtn.disabled = false;
    resultSection.style.display = 'none';

    // Preview file
    previewFile(file);
}

// Preview file contents
async function previewFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/preview', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.error) {
            previewTable.innerHTML = `<p style="color: #ef4444; padding: 1rem;">${data.error}</p>`;
            return;
        }

        // Build table
        let html = '<table><thead><tr>';
        data.columns.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr></thead><tbody>';

        data.preview.forEach(row => {
            html += '<tr>';
            data.columns.forEach(col => {
                const val = row[col] !== null && row[col] !== undefined ? row[col] : '';
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        previewTable.innerHTML = html;

    } catch (error) {
        previewTable.innerHTML = `<p style="color: #ef4444; padding: 1rem;">Failed to preview file</p>`;
    }
}

// Upload file to server
async function uploadFile() {
    if (!selectedFile) return;

    uploadBtn.disabled = true;
    progressSection.style.display = 'block';
    resultSection.style.display = 'none';
    progressFill.style.width = '10%';
    progressText.textContent = 'Preparing upload...';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('hour', hourInput.value);
    formData.append('date', dateInput.value);
    formData.append('month', monthInput.value);
    formData.append('year', yearInput.value);

    try {
        progressFill.style.width = '30%';
        progressText.textContent = 'Uploading file...';

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        progressFill.style.width = '70%';
        progressText.textContent = 'Processing data...';

        const data = await response.json();

        progressFill.style.width = '100%';
        progressText.textContent = 'Complete!';

        // Show result
        setTimeout(() => {
            progressSection.style.display = 'none';
            resultSection.style.display = 'block';

            if (data.success) {
                resultCard.className = 'result-card success';
                resultIcon.textContent = 'check_circle';
                resultTitle.textContent = 'Upload Successful!';
                resultStats.innerHTML = `
                    <div class="result-stat">
                        <div class="value">${data.total_records.toLocaleString()}</div>
                        <div class="label">Total Records</div>
                    </div>
                    <div class="result-stat">
                        <div class="value">${data.inserted.toLocaleString()}</div>
                        <div class="label">Inserted</div>
                    </div>
                    <div class="result-stat">
                        <div class="value">${data.failed}</div>
                        <div class="label">Failed</div>
                    </div>
                `;
            } else {
                resultCard.className = 'result-card error';
                resultIcon.textContent = 'error';
                resultTitle.textContent = 'Upload Failed';
                resultStats.innerHTML = `<p style="color: #f87171;">${data.error || 'Unknown error occurred'}</p>`;
            }

            uploadBtn.disabled = false;
        }, 500);

    } catch (error) {
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';
        resultCard.className = 'result-card error';
        resultIcon.textContent = 'error';
        resultTitle.textContent = 'Connection Failed';
        resultStats.innerHTML = `<p style="color: #f87171;">${error.message}</p>`;
        uploadBtn.disabled = false;
    }
}

// Remove selected file
function clearFile() {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    dropzone.style.display = 'block';
    uploadBtn.disabled = true;
    previewTable.innerHTML = '';
}

// Event Listeners

// Dropzone click
dropzone.addEventListener('click', () => fileInput.click());

// File input change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Drag events
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

// Remove file button
removeFile.addEventListener('click', clearFile);

// Upload button
uploadBtn.addEventListener('click', uploadFile);

// Initialize
initDateTime();
