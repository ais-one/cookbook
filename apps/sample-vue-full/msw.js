// MSW - https://www.vuemastery.com/blog/mock-service-worker-api-mocking-for-vuejs-development-testing
export default async function prepare() {
  if (import.meta.env.MODE === 'mocked') {
    console.log('MSW NOTE: run once only unless you need to generate again - npx msw init public/');
    console.log('MSW NOTE: if you touch MSW and its related code, you need to do empty cache and hard reload');
    console.log('MSW starting');
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest(request, print) {
        // Do not print warnings on unhandled requests to Sentry.
        if (request.url.includes('sentry.io')) return;
        // Print the regular MSW unhandled request warning otherwise.
        // print.warning()
        console.log('[MSW]', request.method, request.url);
      },
    });
  }
}

prepare()
  .then(() => console.log('MSW prepared'))
  .catch(err => console.log(err)); // MSW
