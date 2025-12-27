# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Stripe & Backend configuration

1. Add your Stripe publishable key and backend URL to `app.json` under `expo.extra`:

```json
"extra": {
   "stripePublishableKey": "pk_live_... or pk_test_...",
   "apiUrl": "http://10.0.2.2:4000"
}
```

2. For local Android emulators use `http://10.0.2.2:4000` for the Nest backend; for iOS simulator use `http://localhost:4000`.

3. The app currently uses the PaymentSheet flow and expects the backend endpoint `POST /payments/join-auction` to return a client secret. The backend (nest-api) already contains a sample `PaymentsService` that uses `process.env.STRIPE_SECRET_KEY`.

4. To run backend locally set `STRIPE_SECRET_KEY` in your environment and start the server:

```bash
cd ../nest-api
export STRIPE_SECRET_KEY="sk_test_..."
npm run start:dev
```

5. Then run the Expo app:

```bash
cd client-mobile
npm install
npx expo start
```
