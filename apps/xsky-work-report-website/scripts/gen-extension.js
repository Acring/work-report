// 执行 shell 命令

const { exec } = require('child_process');

const version = require('../../xsky-work-report/package.json').version;

console.log('version:', version);

exec(
  `cd apps/xsky-work-report && ls && 
  zip -r work-report-v${version}.zip ./dist manifest.json icon.png package.json README.md && 
  mv work-report-v${version}.zip ../xsky-work-report-website/public && 
  echo "NEXT_PUBLIC_EXTENSION_VERSION=${version}" > ../xsky-work-report-website/.env
  `,
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);

      return;
    }

    console.log('Done');
  }
);
