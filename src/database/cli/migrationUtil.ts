#!/usr/bin/env node
import { Client } from 'pg';
import { create, migrate, revert } from 'ts-rove';

export const run = async (
  [command, arg, param]: string[],
  client: Client,
  migrationDir: string
) => {
  await client.connect();

  const roveArgs = {
    client,
    migrationDir,
    to: param,
  };
  switch (command) {
    case 'create':
      await create({ migrationDir, migrationName: arg });
      break;
    case 'migrate':
      await migrate(roveArgs);
      break;
    case 'revert':
      await revert(roveArgs);
      break;
    default:
      console.log('Unknown command');
  }

  await client.end();
};
