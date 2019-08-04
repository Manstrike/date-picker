$(document).ready(readyHandler);

const format = 'YYYY-MM-DD';
const currentDate = moment().format(format);
const applyDate = {
    rangeStart: currentDate,
    rangeEnd: currentDate,
};

const Unit = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter',
    YEAR: 'year',
    TODAY: 'today',
}

const Mode = {
    PRESENT: 'Present',
    PREVIOUS: 'Previous',
    TO_DATE: 'to-date',
}

const momentUnitMapping = {
    [Unit.DAY] : 'day',
    [Unit.WEEK] : 'isoWeek',
    [Unit.MONTH] : 'month',
    [Unit.QUARTER] : 'quarter',
    [Unit.YEAR] : 'year',
    [Unit.TODAY] : 'day'
}

function readyHandler() {
    pickmeup('.template', {  
        default_date: false,
        flat: true,
        mode: 'range',
        calendars: 2,
        format	: 'Y-m-d',
    });

    $('a').click(presetHandler);

    $('.ui-widget-content').change(customHandler);

    $('.apply-button').click(applyHandler);

    textOnLabel();
}

function customHandler() {
    const mode = $(this).attr('id');
    const timeUnits = $(this).val();
    const findInput = 'txt' + mode; 
    const unitCount = $(`#${findInput}`).val();

    const dateRange = calculateDateRange(mode, timeUnits, unitCount);
    pickmeup('.template').set_date(dateRange);
}

function presetHandler() {
    $('a').removeClass();
    $(this).addClass('selected');

    const timeUnits = $(this).data('value');

    const dateRange = calculatePresetDates(timeUnits);

    pickmeup('.template').set_date(dateRange);    
}

function applyHandler(e) {
    e.preventDefault();
    const temporaryDate = pickmeup('.template').get_date(true);
    const calendarID = $('.template').attr('id');

    applyDate.calendarID = calendarID;
    applyDate.rangeStart = temporaryDate[0];
    applyDate.rangeEnd = temporaryDate[1];
    applyDate.rolling = 1;

    textOnLabel();
}

function setStartDate(mode, unitCount) {
    if (mode === Mode.PRESENT) {
        return unitCount-1;
    }

    return unitCount;
}

function setEndDate(mode, units) {
    let endDate;
    switch (mode) {
        case Mode.PRESENT :
            endDate = moment().endOf(units).format(format);
            break;
        case Mode.PREVIOUS :
            endDate = moment().subtract(1, units).endOf(units).format(format);
            break;
        case Mode.TO_DATE :
            endDate = moment().format(format);
            break;
    }

    return endDate;
}

function calculateDateRange(mode, timeUnits, unitCount) {
    const temporaryDateRange = [];

    const startDate = setStartDate(mode, unitCount)

    const units = momentUnitMapping[timeUnits];    

    
    const start = moment().startOf(units).subtract(startDate, units).format(format);
    const end = setEndDate(mode, units);

    temporaryDateRange.push(start);
    temporaryDateRange.push(end);

    return temporaryDateRange;
}

function calculatePresetDates(timeUnits) {
    const today = moment().format(format);

    if (timeUnits === Unit.TODAY) {
        return [today, today];
    }

    if (timeUnits === Unit.DAY) {
        const yesterday = moment().subtract(1,'days').format(format);
        return [yesterday, yesterday];
    }

    const units = momentUnitMapping[timeUnits];
    const start = moment().startOf(units).format(format);

    return [start, today];
}

function textOnLabel() {
    const dateLabelStart = applyDate.rangeStart;
    const dateLabelEnd = applyDate.rangeEnd;
    $('#selected-date').text(`${dateLabelStart} - ${dateLabelEnd}`);
}

