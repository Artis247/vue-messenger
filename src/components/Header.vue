<template>
    <div class="header-container" :style="{background: colors.header.bg}">
        <slot name="header" :colors="colors" :chatTitle="chatTitle"
              :participants="participants"
              :myself="myself"></slot>
        <div v-if="!hasHeaderSlot" class="header-title">
            <p class="header-title-text" :style="{color: colors.header.text}">{{chatTitle}}</p>
            <p class="header-paticipants-text">
                <!--   <span>{{myself.name}},{{"-"}},{{participants[0].name}}</span>  -->
                <img class="participant-thumb" :src="require('../assets/images/' + this.$store.state.myself.profilePicture)"
                     :style="{'width': '25px', 'height': '25px', 'border-radius': '50%'}">
           
               
                <img class="participant-thumb" :src="require('../assets/images/' + this.$store.state.participants[0].profilePicture)"
                     :style="{'width': '25px', 'height': '25px', 'border-radius': '50%'}">
            </p> 
        </div>

        <div v-if="!hideCloseButton && !hasHeaderSlot" class="header-exit">
            <slot name="close-button">
                <a class="header-exit-button" href="#" 
                   :style="{'fontSize': 'closeButtonIconSize','padding': '15px'}"
                   @click.prevent="update">Обновить</a>
                <a class="header-exit-button" href="#" 
                   :style="{'fontSize': 'closeButtonIconSize','padding': '10px'}"
                   @click.prevent="onClose">✕</a>
            </slot>
        </div>
    </div>
</template>

<script>
    
    export default {
        props: {
            colors: {
                type: Object,
                required: true
            },
            borderStyle: {
                type: Object,
                required: false,
                default: () => {
                    return {
                        topLeft: "10px",
                        topRight: "10px",
                        bottomLeft: "10px",
                        bottomRight: "10px",
                    }
                }
            },
            hideCloseButton: {
                type: Boolean,
                required: false,
                default: false
            },
            closeButtonIconSize: {
                type: String,
                required: false,
                default: "15px"
            },
        },
        computed: {
            participants() {
                return this.$store.state.participants;
            },
            myself() {
                return this.$store.state.myself;
            },
            chatTitle() {
                return this.$store.state.chatTitle;
            },
            hasHeaderSlot: function () {
                return !!this.$slots['header'];
            }
        },
        methods:{
            onClose: function(){
                this.$emit("onClose")
            },
            update: function(){
                  this.$emit("update") 
            }
        }
    }
</script>

<style lang="less">
    .quick-chat-container .header-container {
        height: 70px;
        display: flex;
        padding: 0 20px 0 10px;
        align-items: center;
        -webkit-box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
        box-shadow: 0 2px 20px 2px rgba(90, 90, 90, 0.47);
        z-index: 5;

        .header-title {
            padding: 10px;
            flex: 1;
            text-align: left;
        }

        .header-title-text {
            margin-bottom: 0;
        }

        .header-paticipants-text {
            color: #e4e4e4;
            font-size: 12px;
            margin-top: 5px;
            max-height: 30px;
            overflow: hidden;
        }

        .header-exit-button {
            text-decoration: none;
            color: #fff;
            font-size: 20px;
        }

        .icon-close-chat {
            color: #fff;
            width: 100%;
        }

        .icon-close-chat:hover {
            color: rgb(238, 121, 121)
        }
    
    .participant-thumb{
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-left: 10px;
        }
    }
</style>
