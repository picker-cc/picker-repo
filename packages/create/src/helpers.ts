/* tslint:disable:no-console */
import { execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import semver from 'semver';
import { SERVER_PORT, TYPESCRIPT_VERSION } from './constants';
import { CliLogLevel, DbType } from './types';

/**
 * If project only contains files generated by GH, it’s safe.
 * Also, if project contains remnant error logs from a previous
 * installation, lets remove them now.
 * We also special case IJ-based products .idea because it integrates with CRA:
 * https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
 *
 * 参考 create-react-app 创建项目
 */
export function isSafeToCreateProjectIn(root: string, name: string) {
  // 这些文件应该被允许保留在失败的安装中，但在下次创建时将被删除。
  const errorLogFilePatterns = [
    'npm-debug.log',
    'yarn-error.log',
    'yarn-debug.log',
    'pnpm-error.log',
    'pnpm-debug.log'
  ];
  const validFiles = [
    '.DS_Store',
    'Thumbs.db',
    '.git',
    '.gitignore',
    '.idea',
    'README.md',
    'LICENSE',
    '.hg',
    '.hgignore',
    '.hgcheck',
    '.npmignore',
    'mkdocs.yml',
    'docs',
    '.travis.yml',
    '.gitlab-ci.yml',
    '.gitattributes'
  ];
  console.log();

  const conflicts = fs
    .readdirSync(root)
    .filter(file => !validFiles.includes(file))
    // IntelliJ IDEA 在 CRA 启动之前创建模块文件
    .filter(file => !/\.iml$/.test(file))
    // 不要将之前安装的日志文件视为冲突
    .filter(file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0));

  if (conflicts.length > 0) {
    console.log(`目录 ${chalk.green(name)} 包含可能发生冲突的文件:`);
    console.log();
    for (const file of conflicts) {
      console.log(`  ${file}`);
    }
    console.log();
    console.log('尝试使用新的目录名，或者删除上面列出的文件。');

    return false;
  }

  // 从以前的安装中删除任何残留文件
  const currentFiles = fs.readdirSync(path.join(root));
  currentFiles.forEach(file => {
    errorLogFilePatterns.forEach(errorLogFilePattern => {
      // This will catch `(npm-debug|yarn-error|yarn-debug|pnpm-error|pnpm-debug).log*` files
      if (file.indexOf(errorLogFilePattern) === 0) {
        fs.removeSync(path.join(root, file));
      }
    });
  });
  return true;
}

export function checkNodeVersion(requiredVersion: string) {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      chalk.red('您正在运行 Node %s。\n' + 'Picker 要求的 Node %s 或更高版本。\n' + '请更新 Node 版本。'),
      process.version,
      requiredVersion
    );
    process.exit(1);
  }
}

export function shouldUserPnpm() {
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

export function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
export function checkThatNpmCanReadCwd() {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    // Note: intentionally using spawn over exec since
    // the problem doesn't reproduce otherwise.
    // `npm config list` is the only reliable way I could find
    // to reproduce the wrong path. Just printing process.cwd()
    // in a Node process was not enough.
    // 注意:有意使用spawn over exec，因为问题不会以其他方式重现。
    // `npm config list` 是我能找到的复制错误路径的唯一可靠方法。
    // 仅仅在Node进程中打印process.cwd()是不够的。
    childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
  } catch (err) {
    // 生成 node 出错误
    return true;
  }
  if (typeof childOutput !== 'string') {
    return true;
  }
  const lines = childOutput.split('\n');
  // `npm config list` 输出包含以下行：
  // "; cwd = C:\path\to\current\dir" (unquoted)
  const prefix = '; cwd = ';
  const line = lines.find(l => l.indexOf(prefix) === 0);
  if (typeof line !== 'string') {
    return true;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return true;
  }
  console.error(
    chalk.red(
      `无法在正确的目录中启动 npm 进程。\n\n` +
        `当前目录为：${chalk.bold(cwd)}\n` +
        `然而，一个新启动的 npm 进程运行在：${chalk.bold(npmCWD)}\n\n` +
        `这可能是由于错误配置的系统终端 shell 造成的。`
    )
  );
  if (process.platform === 'win32') {
    console.error(
      `${chalk.red(`在 Windows 上，这通常可以通过运行来解决:\n\n`)}  ${chalk.cyan(
        'reg'
      )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
        `  ${chalk.cyan('reg')} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n${chalk.red(
          `Try to run the above two lines in the terminal.\n`
        )}${chalk.red(
          `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
        )}`
    );
  }
  return false;
}

/**
 * Install packages via npm or yarn.
 * 使用 npm、yarn、pnpm 安装包
 * Based on the install function from https://github.com/facebook/create-react-app
 */
export function installPackages(
  root: string,
  usePnpm: boolean,
  dependencies: string[],
  isDev: boolean,
  logLevel: CliLogLevel,
  isCi = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];
    // if (usePnpm) {
    //     command = 'pnpm';
    //     args = ['add', '-E']
    // }
    if (usePnpm) {
      // command = 'yarnpkg';
      command = 'pnpm';
      // --save-dev, -D
      // 将指定的 packages 安装为 devDependencies。
      // --save-exact, -E
      // 保存的依赖会被指定为一个确切的版本, 而不是使用 pnpm 的默认 semver range operator 配置.
      args = ['add', '--save-exact'];
      if (isDev) {
        args.push('-D');
      }
      if (isCi) {
        // In CI, publish to Verdaccio
        // See https://verdaccio.org/docs/setup-pnpm/
        args.push('--registry http://localhost:4873/');
        // Increase network timeout
        args.push('--network-timeout 300000');
      }
      args = args.concat(dependencies);

      // Explicitly set cwd() to work around issues like
      // 显示地设置 cwd() 来解决诸如
      // https://github.com/facebook/create-react-app/issues/3326.
      // Unfortunately we can only do this for Yarn because npm support for
      // equivalent --prefix flag doesn't help with this issue.
      // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
      // args.push('--cwd');
      // args.push(root);
    } else {
      command = 'npm';
      args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
      if (isDev) {
        args.push('--save-dev');
      }
    }

    if (logLevel === 'verbose') {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: logLevel === 'silent' ? 'ignore' : 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        let message = '安装依赖项时出错';
        if (logLevel === 'silent') {
          message += ', 请尝试运行 `--log-level info` 或 `--log-level verbose` 进行诊断。';
        }
        reject({
          message,
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}

export function getDependencies(
  usingTs: boolean,
  dbType: DbType,
  pickerPkgVersion = ''
): { dependencies: string[]; devDependencies: string[] } {
  const dependencies = [
    `@pickerjs/common${pickerPkgVersion}`,
    `@pickerjs/core${pickerPkgVersion}`,
    `prisma`,
    `@prisma/client`,
    `@nestjs/common`,
    `@nestjs/graphql`,
    `@nestjs/platform-express`,
    `@apollo/server`,
    // `apollo-server-express`,
    `cache-manager`,
    `dotenv`,
    `express`,
    `graphql-tag`,
    `reflect-metadata`,
    `rxjs`
    // `@pickerjs/email-plugin${vendurePkgVersion}`,
    // `@pickerjs/asset-server-plugin${pickerPkgVersion}`,
    // `@pickerjs/admin-ui-plugin${vendurePkgVersion}`,
    // dbDriverPackage(dbType),
  ];
  const devDependencies = [
    'concurrently',
    `@caixiejs/cli`,
    `@nestjs/testing`,
    `@types/express`,
    `@types/jest`,
    `eslint`,
    `eslint-config-caixiejs`,
    `ts-jest`,
    `ts-node`,
    `ts-node-dev`
  ];
  if (usingTs) {
    devDependencies.push('ts-node');
    dependencies.push(`typescript@${TYPESCRIPT_VERSION}`);
  }

  return { dependencies, devDependencies };
}

/**
 * Returns the name of the npm driver package for the
 * selected database.
 */
// function dbDriverPackage(dbType: DbType): string {
//     switch (dbType) {
//         case "cockroachdb":
//             break;
//         case "mongodb":
//             break;
//         case 'mysql':
//         case 'mariadb':
//             return 'mysql';
//         case 'postgres':
//             return 'pg';
//         case 'sqlite':
//             return 'better-sqlite3';
//         case 'mssql':
//             return 'mssql';
//         default:
//             const n: never = dbType;
//             console.error(chalk.red(`No driver package configured for type "${dbType}"`));
//             return '';
//     }
// }

/**
 * 检查指定的DB连接选项是否正常工作(即可以建立连接)，并且指定的数据库是否存在。
 */
// export function checkDbConnection(options: any, root: string): Promise<true> {
//     switch (options.type) {
//         case 'mysql':
//             return checkMysqlDbExists(options, root);
//         case 'postgres':
//             return checkPostgresDbExists(options, root);
//         default:
//             return Promise.resolve(true);
//     }
// }

// async function checkMysqlDbExists(options: any, root: string): Promise<true> {
//     const mysql = await import(path.join(root, 'node_modules/mysql'));
//     const connectionOptions = {
//         host: options.host,
//         user: options.username,
//         password: options.password,
//         port: options.port,
//         database: options.database,
//     };
//     const connection = mysql.createConnection(connectionOptions);
//
//     return new Promise<boolean>((resolve, reject) => {
//         connection.connect((err: any) => {
//             if (err) {
//                 if (err.code === 'ER_BAD_DB_ERROR') {
//                     throwDatabaseDoesNotExist(options.database);
//                 }
//                 throwConnectionError(err);
//             }
//             resolve(true);
//         });
//     }).then(() => {
//         return new Promise((resolve, reject) => {
//             connection.end((err: any) => {
//                 resolve(true);
//             });
//         });
//     });
// }

// async function checkPostgresDbExists(options: any, root: string): Promise<true> {
//     const { Client } = await import(path.join(root, 'node_modules/pg'));
//     const connectionOptions = {
//         host: options.host,
//         user: options.username,
//         password: options.password,
//         port: options.port,
//         database: options.database,
//     };
//     const client = new Client(connectionOptions);
//
//     try {
//         await client.connect();
//     } catch (e: any) {
//         if (e.code === '3D000') {
//             throwDatabaseDoesNotExist(options.database);
//         }
//         throwConnectionError(e);
//         await client.end();
//         throw e;
//     }
//     await client.end();
//     return true;
// }

// function throwConnectionError(err: any) {
//     throw new Error(
//         `无法连接到数据库 ` +
//             `请检查您的 Picker 配置中的连接设置\n[${
//                 err.message || err.toString()
//             }]`,
//     );
// }

// function throwDatabaseDoesNotExist(name: string) {
//     throw new Error(`数据库 "${name}" 不存在。请创建数据库，然后重试。`);
// }

export async function isServerPortInUse(): Promise<boolean> {
  const tcpPortUsed = require('tcp-port-used');
  try {
    return tcpPortUsed.check(SERVER_PORT);
  } catch (e) {
    console.log(chalk.yellow(`警告: 无法确定端口 ${SERVER_PORT} 是否可用。`));
    return false;
  }
}
