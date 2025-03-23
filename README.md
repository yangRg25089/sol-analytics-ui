# Sol Analytics UI

基于 React + TypeScript 的 Solana 交易分析界面。

## 环境要求

- Node.js (推荐使用 nvm 管理)
- npm 或 yarn

## 环境搭建

1. 安装 nvm (Node Version Manager):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

2. 配置 nvm（添加到 ~/.zshrc 或 ~/.bashrc）:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

3. 切换到项目目录并使用指定的 Node.js 版本：
```bash
cd sol-analytics-ui
nvm install    # 安装 .nvmrc 中指定的版本
nvm use        # 使用该版本
```

4. 安装项目依赖：
```bash
npm install
```

## 开发

启动开发服务器：
```bash
npm start
```

构建产品版本：
```bash
npm run build
```

运行测试：
```bash
npm test
```

## TypeScript 支持

项目使用 TypeScript 开发，确保在编辑器中启用了 TypeScript 支持。推荐使用 VS Code 编辑器。

## 项目结构

```
sol-analytics-ui/
  ├── src/
  │   ├── components/     # React 组件
  │   ├── types/         # TypeScript 类型定义
  │   └── ...
  ├── public/            # 静态资源
  ├── .nvmrc            # Node.js 版本配置
  ├── tsconfig.json     # TypeScript 配置
  └── package.json      # 项目依赖配置
```

## Features

- **User Account Analysis**: Input a Solana wallet address or connect a wallet to analyze on-chain data.
- **Transaction History**: View and analyze transaction history with visualizations.
- **Asset Holdings**: Display SPL tokens and NFTs held in the wallet.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.