module.exports = {
  apps: [
    {
      name: 'Server',
      script: 'server/server.js',
      error_file: './server.log',
      out_file: './server.log',
      merge_logs: true
    }
  ]
}
