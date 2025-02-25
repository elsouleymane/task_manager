# Step 1: Build the front-end
FROM node:18-alpine as frontend-builder
WORKDIR /app/front
COPY front/package*.json ./
RUN npm install
COPY front/ ./
RUN npm run build

# Step 2: Set up the back-end
FROM python:3.11-alpine as backend-builder
WORKDIR /app/back
COPY back/requirements.txt ./
# Adding verbose output for pip install to debug issues
RUN pip install --no-cache-dir -r requirements.txt --verbose -i https://pypi.org/simple --timeout=120
COPY back/ ./

# Step 3: Create the final image
FROM alpine:3.18



# Copy front-end build files
COPY --from=frontend-builder /app/front/build /app/front/build

# Copy back-end files
COPY --from=backend-builder /app/back /app/back

# Expose necessary ports
EXPOSE 3000 8000

# Start both front-end and back-end servers
CMD ["sh", "-c", "cd /app/back && python manage.py runserver 0.0.0.0:8000 & cd /app/front && npx serve -s build -l 3000"]