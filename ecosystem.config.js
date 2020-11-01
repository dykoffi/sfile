module.exports = {
  apps: [{
    script: 'index.js',
    watch: '.'
  }],

  deploy: {
    production: {
      user: 'dy',
      host: '192.168.43.84',
      ref: 'sinra/master',
      repo: 'ssh://dy@192.168.43.84/home/dy/Projets/sfile/app.git',
      path: '/home/dy/Projets/sfile/app',
      // "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
