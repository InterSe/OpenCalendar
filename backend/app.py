from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import re
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        df = pd.read_excel(filepath)
    except Exception as e:
        return jsonify({"error": f"Failed to read Excel: {str(e)}"}), 400

    expected_columns = [
        'Course ID', 'Course Name', 'Instructor', 'Start Date',
        'Start Time', 'End Time', 'Weeks', 'Room', 'Remarks'
    ]

    df.columns = expected_columns[:len(df.columns)]
    for col in expected_columns:
        if col not in df.columns:
            df[col] = ""

    df['Start Date'] = df['Start Date'].apply(normalize_date)
    df['Start Time'] = df['Start Time'].apply(normalize_time)
    df['End Time'] = df['End Time'].apply(normalize_time)
    df['Weeks'] = df['Weeks'].apply(normalize_weeks)

    df.fillna("-", inplace=True)
    df = df.astype(str).applymap(lambda x: x.strip() if x.strip() else "-")

    df.rename(columns={
        'Course ID': 'course',
        'Course Name': 'course_name',
        'Instructor': 'instructor',
        'Start Date': 'start_date',
        'Start Time': 'start_time',
        'End Time': 'end_time',
        'Weeks': 'weeks',
        'Room': 'room',
        'Remarks': 'remarks'
    }, inplace=True)

    return jsonify(df.to_dict(orient='records'))

def normalize_date(date_val):
    if pd.isnull(date_val):
        return "-"
    try:
        if isinstance(date_val, datetime):
            return date_val.strftime("%Y-%m-%d")
        parsed = pd.to_datetime(str(date_val), errors='coerce', dayfirst=True)
        return parsed.strftime("%Y-%m-%d") if not pd.isnull(parsed) else "-"
    except:
        return "-"

def normalize_time(time_str):
    if pd.isnull(time_str):
        return "-"
    time_str = str(time_str).strip().replace(" ", "")
    parts = re.split(r"[:.]", time_str)
    if len(parts) >= 2:
        try:
            h = int(parts[0])
            m = int(parts[1])
            return f"{h:02d}:{m:02d}"
        except:
            pass
    return "-"

def normalize_weeks(week_str):
    if pd.isnull(week_str):
        return "-"
    cleaned = re.sub(r'\s+', '', str(week_str))
    return cleaned if cleaned else "-"

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port, fallback to 5000 locally
    app.run(host="0.0.0.0", port=port, debug=True)


