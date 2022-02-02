<template>
    <div class="listOfChats" >
        <p class="listOfChats">Список контактов </p>
        
        <div>
            <b-form-select v-model="selected" 
                           class="mt-3"
                           :options="participants" 
                           :select-size="4"
                           value-field="id"
                           text-field="name"/>
            
            </b-form-select>
            <hr>
      
            <b-button variant="outline-primary"
                      @click="choose"> Выбрать </b-button>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions,mapMutations} from 'vuex'
import firestore from '@/firebase/firestore'

export default {
  name: "listofchats",
 // store,
  data() {
       return {
           selected: null,
           sortedTeam: [],
           messagesOld:[]
             }
  
  },
computed: {
    filteredTeam() {
      if (this.sortedTeam.length) {
        return this.sortedTeam;
      } else {
        return this.TEAM;
      }
    },
    participants () {
        
      return this.$store.getters.participants;
    },
    myself () {
      return this.$store.getters.myself;
    }
  },

  watch:  {
 ...mapGetters([
         "TEAM", ,
         "messagesOld"
         ]),
    filteredTeam() {
      if (this.sortedTeam.length) {
        return this.sortedTeam;
      } else {
        return this.TEAM;
      }
    }

 },
  methods: {
            ...mapActions([
                           "GET_TEAM_FROM_API",
                           "GET_MESSAGES_FROM_API",
            ]),
            ...mapMutations([
                'setParticipants',
                'setMyself'
                
            ]),
            
            async choose(val) {
               
               this.$store.state.contacts=this.$store.state.participants
              
                this.$store.state.participants=this.$store.state.participants.
                filter(item => item.id == this.selected);
                this.$store.state.selected=this.selected;

                let array1 = []  
                let array2 = []
                let array3 = []  
                let array4 = []
                let messagesChoose=[];
                await this.GET_MESSAGES_FROM_API();
                array1 =this.$store.state.messagesOld
                .filter(message1=>message1.myselfId == this.$store.state.myself.id)
                
                array2=array1
                .filter(message2=>message2.participantId == this.selected)
                                
                array3 =this.$store.state.messagesOld
                .filter(message1=>message1.myselfId == this.selected)
                array4=array3
                .filter(message2=>message2.participantId == this.$store.state.myself.id)
                
                messagesChoose=array2.concat(array4)
                array1 = []  
                array2 = []
                array1 = messagesChoose
                array2 = array1.sort(function(message, message2){
                  return Date.parse(message.timestamp) - Date.parse(message2.timestamp)
                });
                array2.forEach(message=>{
                  if(message.myselfId !== this.selected)
                  {message.myself = true}else{message.myself = false}
                }) 
                messagesChoose=array2

                this.$store.state.messages=messagesChoose
                this.$store.state.messagesChoose = messagesChoose  
                this.$emit("list");
    }

}
};
</script>

<style lang="less">
.listOfChats {
    flex-basis: 25%;
    box-shadow: 0 0 8px 0 #e0e0e0;
    padding: 10px;
    margin-bottom: 20px;
  
  }
  .message-username-image{
            padding: 6px 10px;
            border-radius: 15px;
            margin: 5px 0 5px 0;
            max-width: 70%;
            position: left;
            display: flex;
            align-items: normal;
            justify-content: left;
        }
  .img-loading{
            height: 20px;
            width: 20px;
            border: 3px solid #ffffff00;
            border-left-color: #847f7f;
            border-top-color: #847f7f;
            border-radius: 50%;
            margin-left: 5px;
            display: inline-block;
            -webkit-animation: spin 1.0s ease infinite;
            animation: spin 1.0s ease infinite;
            position: absolute;
        }

</style>
