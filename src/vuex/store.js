import Vue from 'vue'
import Vuex from 'vuex'
import firestore from '@/firebase/firestore'
import {mapGetters,mapActions, mapMutations} from 'vuex'
import {GET_TEAM_FROM_API,GET_MESSAGES_FROM_API,POST_MESSAGES_TO_API} from '@/vuex/api-requests.js';
import { DateTime } from "luxon";

Vue.use(Vuex);

export default () => {
  return new Vuex.Store({
        state: {
            // isMobile: false,
            // isDesktop: true,
            contacts: [],
            messages: [],
            messagesOld:[],
            messagesChoose:[],
            messagePost :{},
            messagesPost :[],
            myself: {},
            selected: null,
            activePerson:{},
            participants: [],
            chatTitle: '',
            placeholder: ''
            
        },
        mutations: {
            newMessage: (state, message) => {
                message.timestamp = message.timestamp.toISO();
                message.myself = message.participantId === state.myself.id;
                state.messages = [...state.messages, message];
            },
            setParticipants: (state, participants) => {
                state.participants = participants;
            },
            setMyself: (state, myself) => {
                state.myself = myself;
            },
            setMessages: (state, messages) => {
                state.messages = messages.map(message => {
                    if(message.timestamp) (typeof message.timestamp == 'object') && (message.timestamp = DateTime.fromObject(message.timestamp).toISO())
                    else message.timestamp = DateTime.local().toISO();
                    
                    if (!("myself" in message))
                        message.myself = message.participantId === state.myself.id;
                    return message
                });
            },
            setChatTitle: (state, title) => {
                state.chatTitle = title;
            },
            setPlaceholder: (state, placeholder) => {
                state.placeholder = placeholder;
            },
              SET_TEAM_TO_STATE: (state, participants) => {
                state.participants = participants;
               },
               SET_MESSAGEPOST_TO_STATE: (state, messagePost) => {
                state.messagePost = messagePost;
               },
              SET_MESSAGESOLD_TO_STATE: (state, messagesOld) => {
                state.messagesOld = messagesOld;
              }
        },
        actions: {
                GET_TEAM_FROM_FIRESTORE(){
                  return {GET_TEAM_FROM_API()}},

                GET_MESSAGES_FROM_FIRESTORE(){
                  return {GET_MESSAGES_FROM_API()}},
                  
                POST_MESSAGES_TO_FIRESTORE(){
                  return {POST_MESSAGES_TO_APIGET_MESSAGES_FROM_API()}}
        },
        getters: {
            getParticipantById: (state) => (id) => {
                let curr_participant;
                state.participants.forEach(participant => {
                    if (participant.id === id) {
                        curr_participant = participant;
                    }
                });

                return curr_participant;
            },
            messages: (state) => {
                 let messages = []
             
                 state.messages.forEach(message => {
                  
                     let newMessage = {...message};
                     newMessage.timestamp = DateTime.fromISO(newMessage.timestamp);
                    messages.push(newMessage);
                    
                    });
                    
                return messages;
              
            },
              messagesOld(state) {
                return state.messagesOld;
              },
              messagePost(state) {
                console.log("MessagePOST from STORE")
                return state.messagePost;
              },
              TEAM(state) {
                return state.participants;
                
              },
              participants(state) {
                return state.participants;
                // return state.team;
              },
              myself: (state) => {
                return state.myself;
            }
        }
    })
  }