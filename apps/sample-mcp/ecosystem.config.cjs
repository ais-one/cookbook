module.exports = {
  apps: [
    {
      name: 'mcp-svr',
      exec_mode: 'fork_mode', // "cluster",
      instances: '1',
      // script: './dist/index.js',
      script: './server.js',
      // args: "start",
      env: {
        NODE_ENV: 'dev',
      },
    },
  ],
};
