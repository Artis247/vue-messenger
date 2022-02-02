import store from "@/vuex/store";

export default function encode() {
        let messagesOld = this.$store.state.messagesOld;
        let output = "";
    for(let message of messagesOld) {
        let output = "";
        let Temp = [];
        let Temp2 = [];
        let TextSize = message.content.length;
        for (let i = 0; i < TextSize; i++) {
        Temp[i] = message.content.charCodeAt(i);
        Temp2[i] = message.content.charCodeAt(i + 1);
        }
        for (let i = 0; i < TextSize; i = i+2) {
        output += String.fromCharCode(Temp[i] - Temp2[i]);
        }
        message.content = output;
        this.$store.state.messageOld = message
    }
}