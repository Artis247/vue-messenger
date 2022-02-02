<template>
    <div id="app">
        <div class="content">
            <div class="chat-container">
                <Authentification v-if="!auth_visible" @auth="auth"/>
                <Chat v-if="chat"
                      :participants="participants"
                      :myself="myself"
                      :messages="messages"
                      :chat-title="chatTitle"
                      :placeholder="placeholder"
                      :colors="colors"
                      :border-style="borderStyle"
                      :hide-close-button="hideCloseButton"
                      :close-button-icon-size="closeButtonIconSize"
                      :submit-icon-size="submitIconSize"
                      :submit-image-icon-size="submitImageIconSize"
                      :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
                      :async-mode="asyncMode"
                      :scroll-bottom="scrollBottom"
                      :display-header="true"
                      :send-images="true"
                      :profile-picture-config="profilePictureConfig"
                      :timestamp-config="timestampConfig"
                      :link-options="linkOptions"
                      :accept-image-types="'.png,.jpeg,.jpg,.gif'"
                      @onImageClicked="onImageClicked"
                      @onImageSelected="onImageSelected"
                      @onMessageSubmit="onMessageSubmit"
                      @onType="onType"
                      @onClose="onClose('param value')"
                      @update="update"
                      @auth="visible=!visble"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Chat from './components/Chat.vue'
    import store from "./store";
    import firebase from "firebase";
    import { DateTime } from 'luxon';
    import * as imageConversion from 'image-conversion';
    import Authentification from './components/Authentification.vue'
    import firestore from '@/firebase/firestore';
    import {mapGetters,mapActions,mapMutations} from 'vuex'
    
    
    export default {
        name: 'app',
        store: store,
        components: {
            Authentification,
            Chat
        },
        data() {
            return {
                auth_visible: false,
                chat: false,
                participants: [],
                 messages:[],
                  
                chatTitle: 'Диалог',
                placeholder: 'текст',
                colors: {
                    header: {
                        bg: '#36331f',
                        text: '#fff'
                    },
                    message: {
                        myself: {
                            bg: '#058534',
                            text: '#c9f518'
                        },
                        others: {
                            bg: '#262852',
                            text: '#fff'
                        },
                        messagesDisplay: {
                            //bg: 'rgb(247, 243, 243)',
                            //bg: '#f7f3f3'
                            bg: '#918e74'
                        }
                    },
                    submitIcon: '#b91010',
                     submitImageIcon: '#b91010',
                },
                borderStyle: {
                    topLeft: "10px",
                    topRight: "10px",
                    bottomLeft: "10px",
                    bottomRight: "10px",
                },
                hideCloseButton: false,
                submitIconSize: 24,
                submitImageIconSize: 24,
                closeButtonIconSize: "20px",
                asyncMode: true,
                toLoad: [],
                scrollBottom: {
                    messageSent: true,
                    messageReceived: false
                },
                profilePictureConfig: {
                    others: true,
                    myself: true,
                    styles: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%'
                    }
                },
                timestampConfig: {
                    format: 'HH:mm',
                    relative: false
                },
                // there are other options, you can check them here
                // https://soapbox.github.io/linkifyjs/docs/options.html
                linkOptions: {
                    myself: {
                        className: 'myLinkClass',
                        events: {
                            click: function (e) {
                                console.log("Link clicked!",e)
                                //alert('Link clicked!');
                            },
                            mouseover: function (e) {
                                 console.log("Link hovered!",e)
                               // alert('Link hovered!');
                            }
                        },
                            format: function (value, type) {
                            if (type === 'url' && value.length > 50) {
                                value = value.slice(0, 50) + '…';
                            }
                            return value;
                        }
                    },
                    others: {
                        className: 'othersLinkClass',
                        events: {
                            click: function (e) {
                                console.log("Link clicked!",e)
                               // alert('Link clicked!');
                            },
                            mouseover: function (e) {
                                console.log("Link hovered!",e)
                              //  alert('Link hovered!');
                            }
                        },
                            format: function (value, type) {
                            if (type === 'url' && value.length > 50) {
                                value = value.slice(0, 50) + '…';
                            }
                            return value;
                        }
                    }
                }
            }
        },
        computed: {
                ...mapGetters([
                    "TEAM", 
                    "messages",
                    "messagesOld",
                    "messagesPost"
                    ]),
                },
         methods :{
             ...mapActions([
                            "GET_TEAM_FROM_API",
                            "GET_MESSAGES_FROM_API",
                            "POST_MESSAGES_TO_API"
            ]),
             onType: function (e) {
                // eslint-disable-next-line
                console.log('typing');
            },
            loadMoreMessages(resolve) {
                setTimeout(() => {
                    resolve(this.toLoad);
                    //Make sure the loaded messages are also added to our local messages copy or they will be lost
                    this.messages.unshift(...this.toLoad);
                    this.toLoad = [];
                }, 1000);
            },
            async onMessageSubmit(message) {
                /*
                * example simulating an upload callback.
                * It's important to notice that even when your message wasn't send
                * yet to the server you have to add the message into the array
                */
              
              console.log("message",message)
              
             setTimeout(() => {
                    
                    message.myself = true
                    message.uploaded = true
                    message.viewed = true
               }, 2)
              let data = Object.assign({}, message)
              data.timestamp = data.timestamp.toISO()
                 this.$store.state.messagePost = data
                 await this.POST_MESSAGES_TO_API();
            },
            onClose(param) {
                
                this.$store.state.messagesChoose = this.messages
                this.$store.state.messagesPost = this.messages
                .filter(x =>!this.$store.state.messagesOld.some(y => x.timestamp === y.timestamp));
                
               console.log("messagesPost",this.$store.state.messagesPost)
                this.$store.state.messagesPost = [];
              
            },
            async update(){
                let array1 = []; 
                let array2 = [];
                let array3 = []; 
                let array4 = [];
                let messagesChoose=[];
                 this.$store.state.messagesOld = []
                await this.GET_MESSAGES_FROM_API();
               

                array1 =this.$store.state.messagesOld
                .filter(message1=>message1.myselfId == this.$store.state.myself.id)
                
                array2=array1
                .filter(message2=>message2.participantId == this.$store.state.selected)
                                
                array3 =this.$store.state.messagesOld
                .filter(message1=>message1.myselfId == this.$store.state.selected)
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
                  if(message.myselfId !== this.$store.state.selected)
                  {message.myself = true}else{message.myself = false}
                })  
                messagesChoose=array2

                this.$store.state.messages=messagesChoose
                this.$store.state.messagesChoose = messagesChoose  
            },
            
            async auth(e){
            let array=this.$store.state.participants;
            let findName = array.
            find(item => item.name == e.profile.name);
            let findPass = array.
            find(item => item.password == e.profile.password);
            
            if ((findName = findPass)) {
                this.$store.state.myself = array.
                find(item => item.name == e.profile.name);

                this.$store.state.participants = this.$store.state.participants.
                filter((x) => x !== this.$store.state.myself);
           
                await this.GET_TEAM_FROM_API();
                this.auth_visible=!this.auth_visible;
                this.chat=!this.chat;
                this.myself=this.$store.state.myself;
                this.participants=this.$store.state.participants;
            
            } else {alert("retry, please")}     
            },
             async onImageSelected({file, message}){
                console.log({file,message}) 
                let data = Object.assign({}, message)
                data.timestamp = data.timestamp.toISO()
                setTimeout(() => {  
                    message.myself = true
                 }, 2)

                let storageRef = firebase.storage().ref();
            
                console.log(file.name)
                let thisRef = storageRef.child(file.name);
                imageConversion.compressAccurately(file,200).then(res=>{
                    thisRef.put(res).then(function(snapshot) {
                        console.log('Uploaded file!');
                        snapshot.ref.getDownloadURL().then((url) => { 
                            data.src= url
                            data.myself = true
                            data.uploaded = true
                            data.viewed = true
                            console.log("DATA",data)
                            message = data
                          firestore.collection('messagesOld').doc(`${data.id}`).set(data);
                 
                            }).then(function() {
                              console.log("onImageSelected",data);
                             });
                       });
                       console.log("RES",res);
                       })
            }
                }

    
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .chat-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(247, 243, 243);
        padding: 10px 0 10px 0;
        height: 500px;
        width: 350px;
    }

    .external-controller {
        background: #2c3e50;
        height: 300px;
        width: 600px;
        display: flex;
        color: #eee;
    }

    .controller-btn-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
        flex-wrap: wrap;
    }

    .btn-message {
        cursor: pointer;
        background: #eee;
        border: none;
        height: 40px;
        color: #2c3e50;
        border-radius: 5px;
        outline: none;
        transition: 0.3s;
    }

    .btn-participant {
        cursor: pointer;
        background: #eee;
        border: none;
        height: 40px;
        color: #2c3e50;
        border-radius: 5px;
        outline: none;
        transition: 0.3s;
    }

    .btn-message:hover {
        background: rgb(255, 255, 255);
    }

</style>
