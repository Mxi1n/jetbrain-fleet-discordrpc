function extractData(text: string) {
  const regex = /^(.*?)\.(.*?)\s*—\s*(.*?)$/;
  const match = text.match(regex);

  if (match) {
    const fileExtension = match[2].trim();
    const fileName = match[1].trim() + '.' + fileExtension;
    const workspaceName = match[3].trim();

    return {
      fileName,
      fileExtension,
      workspaceName,
    };
  } else {
    const regex = /(\b[A-Za-z?]+\b) — (.+)/i;

    const matches = text.match(regex);
    if (matches) {
      const fileName = matches[1];
      const workspaceName = matches[2];

      return {
        fileName,
        workspaceName
      }
    }
  }
};

import * as run from './runner';

export default function init(value: any) {

  const DiscordRPC = require('discord-rpc');
  const clientId = '774675125349515274';
  DiscordRPC.register(clientId);
  const rpc = new DiscordRPC.Client({ transport: 'ipc' });
  const startTimestamp = new Date();

  let data = extractData(value.title);

  let latest_title: string = '';

  function setActivity(content?: any) {
    if (content && latest_title !== content?.title) {
      let data2 = extractData(content?.title)
      rpc.setActivity({
        details: `Editing ${data2?.fileName}`,
        state: `Workspace: ${data2?.workspaceName}`,
        startTimestamp,
        largeImageKey: data2?.fileExtension,
        largeImageText: 'Editing a FILE',
        smallImageKey: 'fleet-logo',
        smallImageText: 'JetBrains Fleet',
        instance: false,
      });
      latest_title = content?.title;
    } else if (latest_title !== content?.title) {
      rpc.setActivity({
        details: `Editing ${data?.fileName}`,
        state: `Workspace: ${data?.workspaceName}`,
        startTimestamp,
        largeImageKey: data?.fileExtension,
        largeImageText: 'Editing a FILE',
        smallImageKey: 'fleet-logo',
        smallImageText: 'JetBrains Fleet',
        instance: false,
      });
      latest_title = value?.title;
    }
  };

  rpc.on('ready', () => {
    setActivity();

    setInterval(async () => {
      setActivity(await run.Linux());
    }, 3000);
  });

  rpc.login({ clientId }).catch(console.error);

  process.on('unhandledRejection', console.error);
};