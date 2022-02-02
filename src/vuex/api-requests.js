import firestore from '@/firebase/firestore';
import store from '@/vuex/store'
import {code} from '@/utils/code.js';
import {encode} from '@/utils/encode.js';

export default {
  async GET_TEAM_FROM_API(){
    return  await firestore.collection("team").get((snapshot) => {
      this.team = [];

      snapshot.forEach((doc) => {
      this.team.push({
      id: doc.id,
      ...doc.data(),
  });
});
}); 
  },

  async GET_MESSAGES_FROM_API(){
    return  await firestore.collection("messagesOld").get((snapshot) => {
      this.messagesOld = [];

      snapshot.forEach((doc) => {
      this.messagesOld.push({
      id: doc.id,
      ...doc.data(),
  });
});
    encode();  
}); 
  }, 

  async POST_MESSAGES_TO_API() {
    code();    
    await firestore.collection('messagesOld').doc(`${this.$store.state.messagePost.id}`).set(this.$store.state.messagePost);
    this.$store.state.messagePost = {}
       
     }
}