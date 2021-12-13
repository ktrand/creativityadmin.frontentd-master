import Vue from 'vue'
import moment from 'moment'

export default Vue.mixin({
    methods: {
        onCopyUrl() {
            this.$vs.notify({
                title: 'Yes!',
                text: 'Ссылка скопировано.',
                color: 'success',
                iconPack: 'feather',
                position: 'top-center',
                icon: 'icon-copy'
            })

        },
        __age(value) {
            const age = moment().diff(value, 'years');

            let  txt, count = age % 100;

            if (count >= 5 && count <= 20) {
                txt = 'лет';
            } else {
                count = count % 10;
                if (count == 1) {
                    txt = 'год';
                } else if (count >= 2 && count <= 4) {
                    txt = 'года';
                } else {
                    txt = 'лет';
                }
            }

            return age + " " + txt;
        },

        __daysTill(date, duration) {
            let endDate = moment(date).add(duration, 'M');
            return endDate.diff(moment(), 'days') + 1;
        },

        __createdAt(date) {
            return moment(date).startOf('minute').format('lll');
        },

        __updatedAt(date) {
            return moment(date).startOf('minute').format('LLL');
        },

        __paginate(array, pageSize, pageNumber) {
            if (array.length <= pageSize) return array;
            return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        },

        $displayError(error) {
            console.log(error);
            this.$vs.notify({
                title: 'Whops',
                text: error,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
            })
        },
        $storageUrl(url) {
            return process.env.VUE_APP_STORAGE_URL + '/' + url;
        },

        __markSearchedText(text, searched_text){
            if (searched_text.length > 0) {
                searched_text = searched_text.trim();
                let results = searched_text.split(" ");
                for (let i = 0; i < results.length; ++i ) {
                    if (results[i] !== '') {
                        let myRegExp = new RegExp(results[i], 'ig');
                        if (text.match(myRegExp)) {
                            text = text.replace(myRegExp, '<span class="bg-warning">' + results[i].toUpperCase() + '</span>');
                        }
                    }
                }
            }
            return text;
        },

        $toKebabCase(str) {
            return str && str
                .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                .map(x => x.toLowerCase())
                .join('-');
        },

        __transliterate(word) {
            word = word.trim();
            const a = {
                "Ё": "YO", "Й": "I", "Ц": "TS", "У": "U", "К": "K", "Е": "E",
                "Н": "N", "Г": "G", "Ш": "SH", "Щ": "SCH", "З": "Z", "Х": "KH",
                "Ъ": "", "ё": "yo", "й": "i", "ц": "ts", "у": "u", "к": "k",
                "е": "e", "н": "n", "г": "g", "ш": "sh", "щ": "sch", "з": "z",
                "х": "kh", "ъ": "", "Ф": "F", "Ы": "I", "В": "V", "А": "a",
                "П": "P", "Р": "R", "О": "O", "Л": "L", "Д": "D", "Ж": "ZH",
                "Э": "E", "ф": "f", "ы": "i", "в": "v", "а": "a", "п": "p",
                "р": "r", "о": "o", "л": "l", "д": "d", "ж": "zh", "э": "e",
                "Я": "Ya", "Ч": "CH", "С": "S", "М": "M", "И": "I", "Т": "T",
                "Ь": "", "Б": "B", "Ю": "YU", "я": "ya", "ч": "ch", "с": "s",
                "м": "m", "и": "i", "т": "t", "ь": "", "б": "b", "ю": "yu",
                "ҷ": "j", "Ҷ": "J", "ғ": "g", "Ғ": "G", "ҳ": "h", "Ҳ": "H",
                "ӯ": "u", "Ӯ": "U", "қ": "q", "Қ": "Q", "ӣ": "i", "Ӣ": "I"
            };

            return word.split('').map(function (char) {
                return a[char] != undefined ? a[char] : char;
            }).join("").toUpperCase();
        },

        validationErrors(errors){
            errors = Object.entries(errors)
            errors.forEach(element => {
                this.$vs.notify({
                    title: 'О, нет...',
                    text: element[1][0],
                    color: "warning",
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    position: 'top-center',
                });
            });
        }
    }
});