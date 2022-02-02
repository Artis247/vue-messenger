import store from "@/vuex/store";



export default function code() {
              let message = this.$store.state.messagePost;
              let output = "";
              let Temp = [];
              let Temp2 =[];
              let TextSize = message.content.length;
              for (let i = 0; i < TextSize; i++) {
                let rnd = Math.round(Math.random() * 122) + 68;
                Temp[i] = message.content.charCodeAt(i) + rnd;
                Temp2[i] = rnd;
              }
              for (let i = 0; i < TextSize; i++) {
                output += String.fromCharCode(Temp[i], Temp2[i]);
              }
              this.$store.state.messagePost.content = output;
              this.$store.state.messagePost.myself = true
              this.$store.state.messagePost.uploaded = true
              this.$store.state.messagePost.viewed = true
}