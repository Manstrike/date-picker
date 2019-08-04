$(document).ready(readyHandler);

const format = 'YYYY-MM-DD';
const applyDate = {};

const Unit = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    QUARTER: 'quarter',
    YEAR: 'year',
    TODAY: 'today',
}

const Mode = {
    PRESENT: 'Pres',
    PREVIOUS: 'Prev',
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
    /**
     * calendar init
     */
    pickmeup('.template', {  
        default_date: false,
        flat: true,
        mode: 'range',
        calendars: 2,
        format	: 'Y-m-d',
    });

    /**
     * preset-panel handler
     */
    $('a').click(presetHandler);

    /**
     * custom-panel handler
     */
    $('.ui-widget-content').change(customHandler);

    $('.apply-button').click(applyHandler);
}

function customHandler() {
    const mode = $(this).attr('id');
    const timeUnits = String($(this).val()).toLowerCase();
    const findInput = 'txt' + mode; 
    const range = $(`#${findInput}`).val();

    const dateRange = calcDateRange(mode, timeUnits, range);
    pickmeup('.template').set_date(dateRange);
}

function presetHandler() {
    $('a').removeClass();
    $(this).addClass('selected');

    const timeUnits = $(this).data('value');

    const dateRange = calcPresetDates(timeUnits);

    pickmeup('.template').set_date(dateRange);    
}

function applyHandler(e) {
    e.preventDefault();
    const temp = pickmeup('.template').get_date(true);
    const calID = $('.template').attr('id');

    applyDate.calendarID = calID;
    applyDate.rangeStart = temp[0];
    applyDate.rangeEnd = temp[1];
    applyDate.rolling = 1;
}

function setStartDate(mode, range) {
    if (mode === Mode.PRESENT) {
        return range-1;
    }

    return range;
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

function calcDateRange(mode, timeUnits, range) {
    const tempRange = [];

    const startDate = setStartDate(mode, range)

    const units = momentUnitMapping[timeUnits];    

    
    const start = moment().startOf(units).subtract(startDate, units).format(format);
    const end = setEndDate(mode, units);

    tempRange.push(start);
    tempRange.push(end);

    return tempRange;
}

function calcPresetDates(timeUnits) {
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


