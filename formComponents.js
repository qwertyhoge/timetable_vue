function getSelectedValue(form){
    return form.options[form.selectedIndex].value;
}

Vue.component('timetable-form', {
    props: ['dayNames'],
    template: `
<form name="timetable-form">
    Day: 
    <day-select
        v-bind:day-names="dayNames"
    >
    </day-select>
    <br>
    Plan name: 
    <input type="text" name="plan-name"/>
    <br>
    Start time: 
    <input type="time" name="start-time" step="600"/>
    <br>
    End time: 
    <input type="time" name="end-time" step="600"/>
    <br>
    <button type="button"
        v-on:click="addPlan"
    >
    追加
    </button>
</form>
`,
    methods: {
        addPlan: function() {
            const form = document['timetable-form'];

            const day = getSelectedValue(form['day-select']);
            const startTime = form['start-time'].value;
            const endTime = form['end-time'].value;
            const planName = form['plan-name'].value;

            const plan = {
                name: planName,
                startTime: startTime,
                endTime: endTime,
            }

            this.$emit('add-plan', day, plan);
        },

        /*
        constructTime: function(hour, minute){
            if(parseInt(hour) < 10){
                hour = '0' + hour;
            }
            if(parseInt(minute) < 10){
                minute = '0' + minute;
            }

            return hour + ':' + minute;
        }
        */
    }
});

Vue.component('day-select', {
    props: ['dayNames'],
    template: `
<select name="day-select">
<option
    v-for="dayName in dayNames"
    v-bind:value="dayName"
>
    {{dayName}}
</option>
</select>
`,
});

/*
Vue.component('hour-select', {
    props: ['selectName'],
    template: `
<select 
    v-bind:name="selectName"
>
    <option 
        v-for="hour in enumeratedHours"
        v-bind:value="hour"
    >
        {{hour}}
    </option>
</select>
`,
    computed: {
        enumeratedHours: function () {
            let hoursList = [];
            for(let i = 0; i < 24; i++){
                hoursList.push(i);
            }
            return hoursList;
        },
    }
});

Vue.component('minute-select', {
    props: ['selectName'],
    template: `
<select 
    v-bind:name="selectName"
>
    <option 
        v-for="minute in enumeratedMinutes"
        v-bind:value="minute"
    >
        {{minute}}
    </option>
</select>
`,
    computed: {
        enumeratedMinutes: function () {
            let minutesList = [];
            for(let i = 0; i < 60; i++){
                minutesList.push(i);
            }
            return minutesList;
        }
    }
});
*/
