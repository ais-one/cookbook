FROM python:3.8.6
EXPOSE 8008

WORKDIR /app
# ADD requirements.txt .
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
# ADD app.py .
COPY . /app
# CMD uvicorn app:app --reload --port 8080 --host 0.0.0.0

ENTRYPOINT ["uvicorn", "app:app", "--reload", "--port", "8080", "--host", "0.0.0.0"]
