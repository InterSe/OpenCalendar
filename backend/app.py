from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime
import re
import os

app = Flask(__name__)
# CORS(app)  In production, restrict to Vercel or Netlify domain
CORS(app, resources={r"/*": {"origins": "*"}})

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

    # Flexible matching of column names
    standard_fields = {
        'course': ['course id', 'course', 'id'],
        'course_name': ['course name', 'name'],
        'instructor': ['instructor', 'lecturer'],
        'start_date': ['start date', 'date'],
        'start_time': ['start time', 'from'],
        'end_time': ['end time', 'to'],
        'weeks': ['weeks', 'week'],
        'room': ['room', 'venue', 'location'],
        'remarks': ['remarks', 'note', 'comments']
    }

    # Normalize column headers
    col_map = {}
    normalized = {col.lower().strip(): col for col in df.columns}
    for key, aliases in standard_fields.items():
        for alias in aliases:
            if alias in normalized:
                col_map[normalized[alias]] = key
                break

    df = df.rename(columns=col_map)

    # Ensure all fields exist
    for key in standard_fields:
        if key not in df.columns:
            df[key] = "-"

    df = df[list(standard_fields)]  # reorder columns

    # Clean
    df['start_date'] = df['start_date'].apply(normalize_date)
    df['start_time'] = df['start_time'].apply(normalize_time)
    df['end_time'] = df['end_time'].apply(normalize_time)
    df['weeks'] = df['weeks'].apply(normalize_weeks)

    df.fillna("-", inplace=True)
    df = df.astype(str).applymap(lambda x: x.strip() if x.strip() else "-")

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

def normalize_time(time_val):
    if pd.isnull(time_val):
        return "-"
    time_str = str(time_val).strip().replace(" ", "")
    parts = re.split(r"[:.]", time_str)
    if len(parts) >= 2:
        try:
            h = int(parts[0])
            m = int(parts[1])
            return f"{h:02d}:{m:02d}"
        except:
            return "-"
    return "-"

def normalize_weeks(week_str):
    if pd.isnull(week_str):
        return "-"
    cleaned = re.sub(r'\s+', '', str(week_str))
    return cleaned if cleaned else "-"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render sets PORT
    app.run(debug=True, host="0.0.0.0", port=port)