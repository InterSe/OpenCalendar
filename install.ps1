param(
    [string]$package
)

pip install $package
pip freeze > requirements.txt

# Remarks Cmd for PC>  .\install.ps1 flask
