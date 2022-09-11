<template>
<span>{{ displayText }}
    <button v-if="isTooLong && !isExpanded" @click="isExpanded = true" class="link" type="button">read more</button>
    <button v-if="isTooLong && isExpanded" @click="isExpanded = false" class="link" type="button">read less</button>
</span>
</template>

<script>
export default {
    data(){
        return {
            isExpanded: false,
            chunks: [],
        }
    },
    props: {
        text: {
            type: String,
            required: true,
        },
        target: {
            type: Number,
            required: true,
        }
    },
    computed: {
        //this checks if the chunks numbers are 2
        isTooLong(){
            return this.chunks.length === 2
        },
        //This displays the chunks generated with getChunks()
        displayText(){
            if(!this.isTooLong || this.isExpanded) return this.chunks.join(' ')
            return this.chunks[0] + '...'
        }
    },
    created(){
        //when created server-side, the component will call getChunks
        this.chunks = this.getChunks()
    },
    methods:{
        getChunks(){
            const position = this.text.indexOf(' ', this.target)
            //if the text is not long enoght to split, it will just return the text
            if(this.text.length <= this.target || position === -1) return [this.text]
            //otherwise, it will split the text into 2 chunks, separated by the space set
            //in the target prop
            return [this.text.substring(0, position), this.text.substring(position)]
        }
    }
}
</script>
<style scoped>
.link {
    color: blue;
    background-color: white;
    border: none;
    text-decoration: underline;
    cursor: pointer;
}
.link:focus{
    border: none;
    outline: none;
}
</style>