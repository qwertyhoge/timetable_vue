Vue.component('day-header', {
    props: ['dayName'],
    template: `
<div
    class="day-header"
    v-bind:class="highlight"
>
    {{dayName}}
</div>
`,

    computed: {
        highlight: function(){
            return {
                'highlight-day-header': this.isCurrent
            }
        },
    },
    methods: {
        // is called from main.js using $refs
        setCurrent: function(current) {
            this.isCurrent = current;
            console.log(`${this.dayName} has newly become current day!`);
        }
    },

    mounted() {
        const dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thirsday', 'friday', 'saturday'];
        const initialDate = new Date().getDay();

        if(dayNameList[initialDate] === this.dayName){
            this.isCurrent = true;
        }
    },

    data: function() {
        return {
            isCurrent: false,
        }
    },
});


Vue.component('timetable-plan', {
    props: ['plan'],
    template: `
<div class="plan"
    v-bind:style="planStyle"
    v-on:mouseover="revealEntire"
    v-on:mouseleave="hideOverflow"
>
    <div class="start-time">
        {{plan.startTime}}
    </div>
    <div
        class="plan-name"
        v-bind:style="'visibility:' + planNameVisibility"
    >
        {{plan.name}}
    </div>
    <div class="end-time">
        {{plan.endTime}}
    </div>
    <div class="buttons">
        <button type="button"
            v-on:click="sendPlan"
            class="delete-button"
        >
            delete
        </button>
    </div>

</div>
`,
    computed: {
        planStyle: function () {
            const startTimeByMinute = this.convertToMinute(this.plan.startTime);
            return {
                top: (startTimeByMinute * 100 / (24 * 60)) + '%',
                left: '0px',
                height: this.styleHeight,
            }
        },

    },
    mounted() {
        this.calculateHeight(); 
        this.hideNameByHeight();
    },
    methods: { 
        convertToMinute: function(timeString){
            [entire, hour, minute] = timeString.match(/(\d+):(\d+)/);
            return parseInt(hour) * 60 + parseInt(minute);
        },
        
        hideNameByHeight: function () {
            const planNameNode = this.$el.getElementsByClassName('plan-name')[0];
            const nameHeight = parseInt(planNameNode.clientHeight);
            const boxHeight = parseInt(this.styleHeight);

            let nameFullHeight = nameHeight;
            const nameComputedStyle = window.getComputedStyle(planNameNode);
            nameFullHeight += parseInt(nameComputedStyle.getPropertyValue('margin-top'));
            nameFullHeight += parseInt(nameComputedStyle.getPropertyValue('margin-bottom'));

            if(boxHeight >= nameFullHeight){
                this.planNameVisibility = 'visible';
            }else{
                this.planNameVisibility = 'hidden';
            }
        },

        calculateHeight: function () {
            const startTimeByMinute = this.convertToMinute(this.plan.startTime);
            const endTimeByMinute = this.convertToMinute(this.plan.endTime);

            const columnHeight = this.$el.parentNode.clientHeight;
            // console.log(`former styleHeight: ${this.styleHeight}`);
            this.styleHeight = (columnHeight * (endTimeByMinute - startTimeByMinute) / 24 / 60) + 'px';
            // console.log(`after styleHeight: ${this.styleHeight}`);
        },
        
        // its column receive this message and it adds the day to this data
        sendPlan: function () {
            this.$emit('delete-plan', this.plan);
        },
        
        revealEntire: function(event) {
            const plan = event.currentTarget;
            plan.classList.add('plan-hover');
            this.planNameVisibility = 'visible';

            if(plan.clientHeight < plan.scrollHeight) {
                this.styleHeight = plan.scrollHeight;
            }

        },

        hideOverflow: function(event) {
            const plan = event.currentTarget;
            plan.classList.remove('plan-hover');

            this.calculateHeight();
            this.hideNameByHeight();
        },
    },
    data: function () {
        return { 
            styleHeight: '0px',
            planNameVisibility: 'hidden',
        }
    }
});

Vue.component('timetable-column', {
    props: ['plans', 'dayName'],
    template: `
<div class="timetable-column">
    <day-header
        v-bind:id="dayName + '-header'"
        v-bind:day-name="dayName"
        ref="header"
    >
    </day-header>
    <div class="plan-wrapper" v-bind:style="wrapperStyle">
        <timetable-plan
            v-for="plan in plans"
            v-bind:key="plan.startTime"
            v-bind:plan="plan"
            v-on:delete-plan="sendDayNameWithPlan"
        >
        </timetable-plan>
    </div>
</div>
`,
    computed: {
        wrapperStyle: function() {
            return {
                position: 'relative',
            }
        }
    },
    methods: {
        sendDayNameWithPlan: function(planData) {
            const deleteData = {
                dayName: this.dayName,
                plan: planData
            };

            this.$emit('delete-plan', deleteData);
        },

        highlightDayHeader: function(highlights) {
            this.$refs.header.setCurrent(highlights);
        }
    },
});