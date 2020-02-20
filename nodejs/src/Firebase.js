import admin from 'firebase-admin';

let firebase;

export function initializeApp() {
  firebase = admin.initializeApp({
    credential: admin.credential.cert({
      type: 'service_account',
      project_id: 'smiling-audio-268001',
      private_key_id: '7706727838515a1dda6f7fc4c5d78ed49ddc1e43',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDbhLtMgVS4XHBn\n+imqPo/5vMP1OyajJGijka+Bj0Wmm0/LJOTcpZmaWVWBpxT5JGqLNdw8OQd6a/b2\nazUmP2R42acUaEn+6ijHQCKwDo5Ql6ZiNpQ4uFfoXaau0TUNcMcj0guzsqbVwu3I\nVJlMxEdyUfWqaSvEBcaqqJWkPNRN8KeOhrybwDrhRwvEb6JUyD8JPawp62aeugoK\nBvRqZ3vY83JHq7zqbnVWIFEEcMOVLrnSXtGPXgt+j/sXYvd+7FDWBoGa2NocdWgF\n7XcrzAw/DIwWK+pdVt3Gv11BRTWuMpGb1B+wUuruMY+Gup3sJ53ftC56ZPBxfCWI\nKqQve6U1AgMBAAECggEAKvwNtQhqL4OiWynoOLbxeGSXNpDzmuSJPOZNKKCGcf5d\nnJjH29DtiATQMogmGjcgScwtKPm91iIIBO6vRKMLKILuLZfSTYFKpOGRKUpgYbWg\nVgD7+zNVu2GDPx4mNlCMHh6GPhTQiHEYIK84KYkRuHgGE+1uLX84DLjgPH3Q0MXf\nFRDWYLH31ZsDNs++IHAUqG8HRF9Esc0NYi6MaSUPpar3PwZTxCX8ftuq8grpRAeK\n/HnuNbJdC6tqTYzMcFU27SG0gs1u8By6kOhz6E6IZ/A7swOkyTQbV4b+n2w09Oaw\nvjPip+XmLlOzn11+VYtBtDPOgLAEabYLhbNv88Mo7QKBgQD1Mb+s3TpN64Zy+xfV\n9qaXB4SCOMCtJKSi0VjsO1NbnmVHlmT9UGw837fQZosmHuP/Tn/fLMaLHMb5dL8d\nHf2QK2WV1QUgNfwTbS/+r1PpqQzM0OXOs4ClV0hgWuEEwuSsbrphaE9k9kRb3EIl\ndv6MhTF+kjeouZaC5jfqIarLPwKBgQDlMU+uL2KgRCc8XkekJdUcmIpuKH5Y+/lK\nwAg/XiXYKPLPG9miSaQM6vwBjNgBBs2cX1jCUQaPcUapuQAYb58nE1iTHHb9jhGL\nYfYCMiwJezIBPE9jXJQAEWunc7DEHhSXD0jsqoI8LJfXyA1QFLy431uYBMXTKg21\nEfXORyA2iwKBgQCZZ62/jo4K8D+nMpfgIzhpJ6fs/Wr3KQTkZUxYSGnH2ZsOJfc7\nUZTWpTXQ6kdG627Ebi2syMvTf4axzixAIGJjT/N3wdY6J+x1jwvHMZSzjTPX9R7C\nqyXizHAY8OL14qXFiGWNygBab4WnX2/3FrL94dtskDjIlIypizYSg0vjawKBgQCK\nNtyYbJcLk04eB7UodnA4WH1SxTS8sOe7fmb63+num3MiFud+CO7Xo3Xp8Wfp5pJk\nNNOwC3DrXCKDA7/c/KN7yxzlSosviVdnOOJEnMEVzqdvO1Gc2B2glODZENmOy50b\nI+qUXpc/dpzzUf9FRdwxmPEBkg9Cst+lTHlxtk7k1QKBgQDVSF/OiwwdexAv5OHk\nkNTvqELUrbFNjjy2K3WC86j4+gKDGUtnZ/ToJYNn90w2SqnGX2B0Q+o2NBCgNZCA\nqZbDX8njQzdjhEFvUSmFRMTJ+V+LaYbQTmtqgnaaIV5ngJQilCuVFbSZgkakr0tB\nenSBaYqCMUvmzxPBlhDm56eoLw==\n-----END PRIVATE KEY-----\n',
      client_email: 'firebase-adminsdk-2fki6@smiling-audio-268001.iam.gserviceaccount.com',
      client_id: '117843645335797562192',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2fki6%40smiling-audio-268001.iam.gserviceaccount.com',
    }),
  });
}

export function getDb() {
  return firebase.firestore();
}

export function getAuth() {
  return firebase.auth();
}
