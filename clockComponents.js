
const bellAudio = new Audio();

Vue.component('clock', {
    props: ['timetable'],
    template:
`
<div>
    {{currentTime}}
</div>
`,

    computed: {
        currentTime: function() {
            return this.currentDate.toLocaleTimeString();
        }
    },
    mounted(){
        this.startGetCurrentTime();
    },

    methods:{
        startGetCurrentTime: function() { 
            let formerminutes = new Date().getMinutes();
            let formerDay = new Date().getDay();

            const timer = setInterval(() => {
                const currentDateObj = new Date();
                this.currentDate = currentDateObj;

                const currentMinutes = currentDateObj.getMinutes();
                if(formerminutes != currentMinutes){
                    formerminutes = currentMinutes;
                    console.log('minute has changed');

                    this.lookForPlanInTime();
                }

                const currentDay = currentDateObj.getDay();
                if(formerDay != currentDay){
                    formerDay = currentDay;
                    console.log('day has changed');

                    this.$emit('day-change', currentDay);
                }

            }, 1000);
        },

        lookForPlanInTime: function() {
            const dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thirsday', 'friday', 'saturday'];
            const currentDay = dayNameList[this.currentDate.getDay()];
            const plans = this.timetable[currentDay].plans;
            let plays = false;

            plans.forEach((elem) => {
                if(this.planConvertToMinutes(elem.startTime) - 5 == this.dateConvertToMinutes(this.currentDate)){
                    plays = true;
                    bellAudio.src = 'audios/first_bell.mp3';
                    console.log('will bell first_bell');
                }
            });
            plans.forEach((elem) => {
                if(this.planConvertToMinutes(elem.endTime) == this.dateConvertToMinutes(this.currentDate)){
                    plays = true;
                    bellAudio.src = 'audios/period_bell.mp3';
                    console.log('will bell period_bell');
                }
            });
            plans.forEach((elem) => {
                if(this.planConvertToMinutes(elem.startTime) == this.dateConvertToMinutes(this.currentDate)){
                    plays = true;
                    bellAudio.src = 'audios/period_bell.mp3';
                    console.log('will bell period_bell');
                }
            });

            if(plays){
                bellAudio.play();
            }

        },

        planConvertToMinutes: function(timeString){
            [entire, hour, minute] = timeString.match(/(\d+):(\d+)/);
            return parseInt(hour) * 60 + parseInt(minute);
        },
        dateConvertToMinutes: function(date){
            return date.getHours() * 60 + date.getMinutes();
        },
        playBell: function(bellPath){
            this.bellAudio.pause();
            this.bellAudio.src = bellPath;
            this.bellAudio.play();
        }
    },

    data: function(){
        return {
            currentDate: new Date(),
        };
    }
});