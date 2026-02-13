I am building a production-ready Django REST Framework project called "FinTrack EMI".

Generate a complete step-by-step implementation including setup and code.

====================================
PHASE 1: PROJECT SETUP
====================================

1. Create a requirements.txt file containing:
   Django
   djangorestframework
   mysqlclient
   djangorestframework-simplejwt
   python-dotenv

2. Provide terminal commands in correct order:
   - pip install -r requirements.txt
   - django-admin startproject fintrack .
   - python manage.py runserver

3. Show expected folder structure after project creation.

====================================
PHASE 2: DATABASE CONFIGURATION
====================================

Configure settings.py to use MySQL with:

DATABASE NAME: fintrack_db
USER: root
PASSWORD: (leave empty)
HOST: 127.0.0.1
PORT: 3306

====================================
PHASE 3: CREATE APPS
====================================

Provide commands to create:

python manage.py startapp users
python manage.py startapp loans
python manage.py startapp payments
python manage.py startapp reminders

Add these apps inside INSTALLED_APPS in settings.py along with:

'rest_framework'

====================================
PHASE 4: JWT CONFIGURATION
====================================

Configure REST_FRAMEWORK and SIMPLE_JWT in settings.py:

- JWT authentication class
- ACCESS token lifetime 60 minutes
- REFRESH token lifetime 1 day

====================================
PHASE 5: MIGRATIONS & ADMIN
====================================

Provide commands:

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

Superuser:
username: admin
password: admin

Explain how to verify tables inside phpMyAdmin.
Explain how to access Django admin at:
http://127.0.0.1:8000/admin

====================================
PHASE 6: CORE PROJECT IMPLEMENTATION
====================================

Now implement the full EMI backend system with clean modular architecture.

Project structure must include:

apps/
    users/
    loans/
    payments/
    reminders/

------------------------------------
LOAN MODEL REQUIREMENTS
------------------------------------

Loan model fields:
- user (ForeignKey to User)
- loan_name
- loan_type
- total_amount
- interest_rate
- tenure_months
- emi_amount (auto-calculated)
- start_date
- status (Active / Closed)

Implement EMI formula:

EMI = P × r × (1+r)^n / ((1+r)^n - 1)

Where:
P = principal
r = monthly interest rate
n = tenure in months

EMI must be calculated automatically in services.py.

------------------------------------
PAYMENT MODEL REQUIREMENTS
------------------------------------

Payment model fields:
- loan (ForeignKey)
- due_date
- paid_date
- principal_component
- interest_component
- penalty
- status (Pending / Paid / Overdue)

------------------------------------
BUSINESS LOGIC
------------------------------------

1. Automatically generate full monthly payment schedule when Loan is created.
2. Calculate principal and interest breakdown per month.
3. Implement overdue detection logic.
4. Add penalty calculation for overdue payments.
5. Create dashboard summary API returning:
   - total monthly EMI
   - total overdue payments
   - upcoming payments
   - total outstanding balance

------------------------------------
API ENDPOINTS
------------------------------------

Auth:
- Register
- Login (JWT)

Loan:
- Create loan
- List loans
- Retrieve loan
- Update loan
- Delete loan

Payment:
- List payments per loan
- Mark EMI as paid

Dashboard:
- Financial summary endpoint

------------------------------------
ARCHITECTURE RULES
------------------------------------

- Use services.py for business logic.
- Keep models clean.
- Use serializers properly.
- Use class-based views (APIView or ViewSets).
- Use clean URLs per app.
- Follow best Django REST practices.

------------------------------------
DELIVERABLES
------------------------------------

Provide complete ready-to-paste:

- models.py
- serializers.py
- views.py
- urls.py
- services.py
- sample test data
- folder structure overview

Do not skip any required logic.
Keep code clean and production structured.
Avoid unnecessary explanations.
Focus on implementation.
