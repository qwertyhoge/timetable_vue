

var app = new Vue({
    el: '#timetable',

    mounted(){
        Object.keys(this.timetable).forEach((key) =>{
            const plans = this.timetable[key].plans;
            plans.sort(this.compareStartTime);
        });
    },
    data: {
        timetable: {
            "sunday": {
                "plans": [
                    {
                        "name": "aaa",
                        "startTime": "03:00",
                        "endTime": "04:00"
                    },
                    {
                        "name": "bbb",
                        "startTime": "04:30",
                        "endTime": "05:00"
                    }
                ],
                "dayName": "sunday",
                "dayId": 1
            },
            "monday": {
                "plans": [
                    {
                        "name": "ccc",
                        "startTime": "03:00",
                        "endTime": "04:00"
                    },
                    {
                        "name": "ddd",
                        "startTime": "04:00",
                        "endTime": "05:00"
                    }
                ],
                "dayName": "monday",
                "dayId": 2
            },
            "tuesday": {
                "plans": [
                    {
                        "name": "eee",
                        "startTime": "03:00",
                        "endTime": "03:30"
                    },
                    {
                        "name": "fff",
                        "startTime": "03:30",
                        "endTime": "05:00"
                    }
                ],
                "dayName": "tuesday",
                "dayId": 3
            },
            "wednesday": {
                "plans": [
                    {
                        "name": "ggg",
                        "startTime": "03:00",
                        "endTime": "03:10"
                    },
                    {
                        "name": "hhh",
                        "startTime": "03:10",
                        "endTime": "03:20"
                    },
                    {
                        "name": "iii",
                        "startTime": "03:20",
                        "endTime": "03:30"
                    }
                ],
                "dayName": "wednesday",
                "dayId": 4
            },
            "thirsday": {
                "plans": [
                    {
                        "name": "jjj",
                        "startTime": "03:00",
                        "endTime": "04:00"
                    },
                    {
                        "name": "kkk",
                        "startTime": "03:30",
                        "endTime": "04:30"
                    }
                ],
                "dayName": "thirsday",
                "dayId": 5
            },
            "friday": {
                "plans": [
                    {
                        "name": "llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
                        "startTime": "03:00",
                        "endTime": "04:00"
                    }
                ],
                "dayName": "friday",
                "dayId": 6
            },
            "saturday": {
                "plans": [],
                "dayName": "saturday",
                "dayId": 7
            }
            /*
            sunday: {
                plans:[
                ],
                dayName: 'sunday',
                dayId: 1,
            },
            monday: {
                plans: [
                ],
                dayName: 'monday',
                dayId: 2,
            },
            tuesday: {
                plans: [
                    
                ],
                dayName: 'tuesday',
                dayId: 3,
            },
            wednesday: {
                plans: [

                ],
                dayName: 'wednesday',
                dayId: 4,
            },
            thirsday: {
                plans: [

                ],
                dayName: 'thirsday',
                dayId: 5,
            },
            friday: {
                plans: [

                ],
                dayName: 'friday',
                dayId: 6,
            },
            saturday: {
                plans: [

               ],
               dayName: 'saturday',
               dayId: 7,
            }
            */
        },
        tableHeight: document.getElementById('timetable').clientHeight,
    },
    computed: {
        getDayNames: function (){
            const columns = Object.keys(this.timetable);

            const dayNames = columns.map((column) => this.timetable[column].dayName);

            return dayNames;
        }
    },

    methods: {
        getIntTimes: function(strTime) {
            const [entire, hour, minutes] = strTime.match(/(\d+):(\d+)/);
            return {hour: hour, minutes: minutes};
        },
        compareStartTime(prev, next){
            const prevStart = this.getIntTimes(prev.startTime);
            const nextStart = this.getIntTimes(next.startTime);

            if(prevStart.hour != nextStart.hour){
                return prevStart.hour < nextStart.hour;
            }
            return prevStart.minutes <= nextStart.minutes;
        },

        // emitted handlers
        pushPlan: function (day, plan) {
            const plans = this.timetable[day].plans;
            const insertMiddle = () => {
                for(let i = 0; i < plans.length; i++){
                    if(this.compareStartTime(plan, plans[i])){
                        plans.splice(i, 0, plan);
                        return true;
                    }
                }
                return false;
            };

            if(insertMiddle() == false){
                plans.push(plan);
            }
        },
        deletePlan: function (deletePlanData) {
            const formerPlans = this.timetable[deletePlanData.dayName].plans;
            const newPlans = formerPlans.filter(plan => plan != deletePlanData.plan);

            this.timetable[deletePlanData.dayName].plans = newPlans;
        },
        importData: function(importedData) {
            console.log(importedData);
            this.timetable = importedData;
        },

        highlightCurrentDay: function (dayId) {
            // this transform from number to name should have been a global function
            const dayNameList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thirsday', 'friday', 'saturday'];

            for(let i = 0; i < 7; i++){
                this.$refs.columns[i].highlightDayHeader(false);
            }
            this.$refs.columns[dayId].highlightDayHeader(true);

        },

    },
});