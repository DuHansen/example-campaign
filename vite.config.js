export default {
  server: {
      proxy: {
          '/api': {
              target: 'https://campaigns.apps.29next.com',
              changeOrigin: true,
              secure: false,
          },
      },
  },
};
