"""
Data Uploader Server - Flask backend for uploading CSV/Excel to Supabase
Handles large datasets (280k+ rows) efficiently with batch processing
"""

import os
import webbrowser
import threading
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Batch size for efficient inserts
BATCH_SIZE = 1000


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and push to Supabase"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Month abbreviations
        MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        
        # Get user-selected datetime values
        hour = int(request.form.get('hour', datetime.now().hour))
        date = int(request.form.get('date', datetime.now().day))
        month = request.form.get('month', MONTHS[datetime.now().month - 1])  # 3-letter format
        year = int(request.form.get('year', datetime.now().year))

        # Read file based on extension
        filename = file.filename.lower()
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file)
        else:
            return jsonify({'error': 'Unsupported file format. Use CSV or Excel.'}), 400

        # Clean column names - lowercase and replace spaces with underscores
        df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')

        # Add timestamp fields
        df['timestamp'] = datetime.now().isoformat()
        df['hour'] = hour
        df['date'] = date
        df['month'] = month
        df['year'] = year

        # Convert DataFrame to list of dicts
        records = df.to_dict(orient='records')
        total_records = len(records)

        # Clean NaN values (Supabase doesn't accept NaN)
        for record in records:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None

        # Batch insert for efficiency
        inserted = 0
        errors = []

        for i in range(0, total_records, BATCH_SIZE):
            batch = records[i:i + BATCH_SIZE]
            try:
                supabase.table('master_data').insert(batch).execute()
                inserted += len(batch)
            except Exception as e:
                errors.append(f"Batch {i // BATCH_SIZE + 1}: {str(e)}")

        result = {
            'success': True,
            'total_records': total_records,
            'inserted': inserted,
            'failed': total_records - inserted,
            'datetime_used': {
                'hour': hour,
                'date': date,
                'month': month,
                'year': year
            }
        }

        if errors:
            result['errors'] = errors[:5]  # Return first 5 errors only

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/preview', methods=['POST'])
def preview_file():
    """Preview first few rows of uploaded file"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        filename = file.filename.lower()

        if filename.endswith('.csv'):
            df = pd.read_csv(file, nrows=10)
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file, nrows=10)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400

        # Clean column names
        df.columns = df.columns.str.lower().str.strip().str.replace(' ', '_')

        return jsonify({
            'columns': list(df.columns),
            'preview': df.head(5).to_dict(orient='records'),
            'total_columns': len(df.columns)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def open_browser():
    """Open browser after server starts"""
    webbrowser.open('http://127.0.0.1:8080')


if __name__ == '__main__':
    # Open browser in a separate thread after a short delay
    threading.Timer(1.5, open_browser).start()
    print("\n🚀 Data Uploader Server running at http://127.0.0.1:8080")
    print("📂 Drag and drop your CSV/Excel file to upload to Supabase\n")
    app.run(host='127.0.0.1', port=8080, debug=False)
