#!/bin/bash
pip install "$1"
pip freeze > requirements.txt

# remarks CMD for Macos> bash install.sh flask
