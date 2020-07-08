Vue.component('data-export', {
    props: ['data'],
    template: `
<div>
    <a
        id="export-button"
        download="timetable.json"
        v-bind:href="downloadUrl"
    >
        download as JSON
    </a>
</div>
`,
    computed: {
        downloadUrl: function() {
            const json = JSON.stringify(this.data, null, '\t');

            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            const blob = new Blob([bom, json], {
                type: 'application/json'
            });

            const url = (window.URL || window.webkitURL).createObjectURL(blob);

            return url;
        }
    },
});


Vue.component('data-import', {
    template: `
<div>
    <input type="file" name="tableData" v-on:change="sendImportedData">
</div>
`,
    methods: {
        sendImportedData: function(event) {
            const dataFile = event.target.files[0];
            const reader = new FileReader();

            reader.readAsText(dataFile);
            reader.addEventListener('load', () => {
                this.$emit('import-data', JSON.parse(reader.result));
            });
        },
    }
});