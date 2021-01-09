import { Injectable } from '@angular/core';
import * as keypair from 'keypair';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  generateKeyPair() {
    var keyPair = keypair();
    localStorage.setItem("pk", keyPair.private);
    return keyPair.public;
  }

  encryptMessage(message: string, publickey: string) {
    var publicKey = forge.pki.publicKeyFromPem(atob(publickey));
    var encrypted = publicKey.encrypt(forge.util.encodeUtf8(message));
    return encrypted;
  }

  decryptMessage(message: string) {
    var privatekey = forge.pki.privateKeyFromPem(localStorage.getItem("pk"));
    var decrypted=privatekey.decrypt(message);
    return forge.util.decodeUtf8(decrypted);
  }

  createSignature(message) {
    var md = forge.md.sha512.create();
    var pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    var privatekey = forge.pki.privateKeyFromPem(localStorage.getItem("pk"));
    md.update(message,'utf-8');
    return privatekey.sign(md,pss);
  }

  verifySignature(signature,message,publickey){
    publickey=atob(publickey);
    var publicKey=forge.pki.publicKeyFromPem(publickey);
    var md = forge.md.sha512.create();
    var pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    md.update(message,'utf-8');
    return publicKey.verify(md.digest().getBytes(),signature,pss);
  }

  
}
