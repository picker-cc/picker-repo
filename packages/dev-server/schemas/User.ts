import { checkbox, list, password, relationship, text, timestamp } from '@pickerjs/core';
import { trackingFields } from './utils';

export const User = list({
  // access: {
  //     operation: {
  //         delete: ({ session }) => session?.data.isAdmin,
  //     }
  // },
  ui: {},
  fields: {
    name: text({
      // validation: {
      //   isRequired: true
      // }
    }),
    identifier: text({
      isIndexed: 'unique',
      validation: {
        isRequired: true
      }
    }),
    deletedAt: timestamp({
      defaultValue: { kind: 'now' }
    }),
    // featured:
    ...trackingFields,
    verified: checkbox({}),
    enabled: checkbox({}),
    lastLogin: timestamp({
      defaultValue: { kind: 'now' }
    }),
    password: password({
      access: {
        update: ({ session, item }) => {
          return session && (session.data.isAdmin || session.itemId === item.id);
        }
      }
    }),
    wechat: relationship({ ref: 'WechatUser.user', many: false }),
    posts: relationship({ ref: 'Post.user', many: true }),
    isAdmin: checkbox({
      access: {
        create: ({ session }) => session?.data.isAdmin,
        update: ({ session }) => session?.data.isAdmin
      }
    })
    // administrator: relationship({
    //     ref: 'Administrator.user',
    // })
  }
});
