import Vue from 'vue';
import moment from 'moment';

Vue.filter('capitalize', function (value) {
    if (!value) return '';
    value = value.toString();
    let arr = value.split(" ");
    let capitalized_array = [];
    arr.forEach((word) => {
        let capitalized = word.charAt(0).toUpperCase() + word.slice(1);
        capitalized_array.push(capitalized);
    });
    return capitalized_array.join(" ");
});

Vue.filter('truncate', function (value, limit) {
    return value.substring(0, limit)
});

Vue.filter('truncateWords', function (value, limit) {
    return value.trim().split(" ").splice(0, limit).join(" ");
});

Vue.filter('tailing', function (value, tail) {
    return value + tail;
});

Vue.filter('time', function (value, is24HrFormat = false) {
    if (value) {
        const date = new Date(Date.parse(value));
        let hours = date.getHours();
        const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        if (!is24HrFormat) {
            const time = hours > 12 ? 'AM' : 'PM';
            hours = hours % 12 || 12;
            return hours + ':' + min + ' ' + time
        }
        return hours + ':' + min
    }
});

Vue.filter('date', function (value, fullDate = false) {
    value = String(value);
    const date = value.slice(8, 10).trim();
    const month = value.slice(4, 7).trim();
    const year = value.slice(11, 15);

    if (!fullDate) return date + ' ' + month;
    else return date + ' ' + month + ' ' + year;
});

Vue.filter('timeOnlineInPage', function (value) {
    let online = moment(value);
    return 'на данной странице с ' + online.format('LT');
});

Vue.filter('datetime', function (value) {
    return moment(value).format('LLL');
});

Vue.filter('onlytime', function (value) {
    value = String(value);
    const time = value.slice(11, 13);
    const mins = value.slice(14, 16);

    return time + ':' + mins;
});

Vue.filter('fromNow', function (value) {
    return moment(value).fromNow();
});

Vue.filter('calendar', function (value) {
    return moment(value).calendar();
});

Vue.filter('justDate', function (value) {
    return moment(value).format("DD.MM.YYYY");
});

Vue.filter('dateYearTime', function (value) {
    return moment(value).format('LLL');
});

Vue.filter('age', function (value) {
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
});

Vue.filter('onlydate', function (value) {
    return moment(value).format('L');
});

Vue.filter('csv', function (value) {
    return value.join(', ')
});

Vue.filter('filter_tags', function (value) {
    return value.replace(/<\/?[^>]+(>|$)/g, "")
});

Vue.filter('k_formatter', function (num) {
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
});