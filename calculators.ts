export type Field = { key: string; label: string; unit?: string; initial: number; min?: number; step?: number };
export type CalculatorDefinition = {
  slug: string; category: string; name: string; description: string; fields: Field[];
  calculate: (v: Record<string, number>) => { label: string; value: number; unit?: string }[];
};
const f = (key:string,label:string,initial:number,unit?:string,min=0,step=1):Field=>({key,label,initial,unit,min,step});
const one = (label:string,value:number,unit='')=>[{label,value,unit}];
export const calculators: CalculatorDefinition[] = [
{slug:'percentage',category:'Math',name:'Percentage Calculator',description:'Find a percentage of a number or compare two values.',fields:[f('value','Value',250),f('percent','Percentage',15,'%')],calculate:v=>one('Result',v.value*v.percent/100)},
{slug:'percentage-change',category:'Math',name:'Percentage Change',description:'Measure the increase or decrease between two values.',fields:[f('old','Original value',120),f('next','New value',150)],calculate:v=>one('Change',v.old===0?0:(v.next-v.old)/Math.abs(v.old)*100,'%')},
{slug:'average',category:'Math',name:'Average Calculator',description:'Calculate the arithmetic mean of three values.',fields:[f('a','Value A',12),f('b','Value B',18),f('c','Value C',24)],calculate:v=>one('Average',(v.a+v.b+v.c)/3)},
{slug:'fraction-to-decimal',category:'Math',name:'Fraction Calculator',description:'Convert a fraction into a decimal value.',fields:[f('numerator','Numerator',3),f('denominator','Denominator',4)],calculate:v=>one('Decimal',v.denominator===0?0:v.numerator/v.denominator)},
{slug:'triangle-area',category:'Math',name:'Triangle Area',description:'Calculate triangle area from base and height.',fields:[f('base','Base',12,'units'),f('height','Height',8,'units')],calculate:v=>one('Area',v.base*v.height/2,'square units')},
{slug:'circle',category:'Math',name:'Circle Calculator',description:'Calculate circle area and circumference.',fields:[f('radius','Radius',5,'units')],calculate:v=>[{label:'Area',value:Math.PI*v.radius*v.radius,unit:'square units'},{label:'Circumference',value:2*Math.PI*v.radius,unit:'units'}]},
{slug:'rectangle',category:'Math',name:'Rectangle Calculator',description:'Calculate area and perimeter of a rectangle.',fields:[f('length','Length',10,'units'),f('width','Width',6,'units')],calculate:v=>[{label:'Area',value:v.length*v.width,unit:'square units'},{label:'Perimeter',value:2*(v.length+v.width),unit:'units'}]},
{slug:'pythagorean',category:'Math',name:'Pythagorean Theorem',description:'Find the hypotenuse of a right triangle.',fields:[f('a','Side A',3),f('b','Side B',4)],calculate:v=>one('Hypotenuse',Math.hypot(v.a,v.b))},
{slug:'bmi',category:'Health',name:'BMI Calculator',description:'Estimate body mass index from weight and height.',fields:[f('weight','Weight',70,'kg'),f('height','Height',1.75,'m',0.1,0.01)],calculate:v=>one('BMI',v.height<=0?0:v.weight/(v.height*v.height),'kg/m²')},
{slug:'calorie-estimate',category:'Health',name:'Daily Calorie Estimate',description:'Estimate basal metabolic rate using a simplified formula.',fields:[f('weight','Weight',70,'kg'),f('height','Height',175,'cm'),f('age','Age',30,'years'),f('sex','Sex factor (male 5 / female -161)',5,'',-161,1)],calculate:v=>one('Estimated BMR',10*v.weight+6.25*v.height-5*v.age+v.sex,'kcal/day')},
{slug:'water-intake',category:'Health',name:'Daily Water Intake',description:'Estimate a daily water target based on body weight.',fields:[f('weight','Weight',70,'kg')],calculate:v=>one('Daily target',v.weight*35,'ml')},
{slug:'pace',category:'Health',name:'Running Pace',description:'Calculate pace per kilometre from distance and time.',fields:[f('distance','Distance',5,'km'),f('minutes','Time',28,'minutes')],calculate:v=>one('Pace',v.distance<=0?0:v.minutes/v.distance,'min/km')},
{slug:'profit-margin',category:'Business',name:'Profit Margin',description:'Calculate profit and margin from cost and selling price.',fields:[f('cost','Cost',60),f('price','Selling price',100)],calculate:v=>[{label:'Profit',value:v.price-v.cost},{label:'Margin',value:v.price===0?0:(v.price-v.cost)/v.price*100,unit:'%'}]},
{slug:'markup',category:'Business',name:'Markup Calculator',description:'Calculate selling price from cost and markup.',fields:[f('cost','Cost',50),f('markup','Markup',40,'%')],calculate:v=>one('Selling price',v.cost*(1+v.markup/100))},
{slug:'discount',category:'Business',name:'Discount Calculator',description:'Find the final price after a discount.',fields:[f('price','Original price',120),f('discount','Discount',20,'%')],calculate:v=>[{label:'You save',value:v.price*v.discount/100},{label:'Final price',value:v.price*(1-v.discount/100)}]},
{slug:'sales-tax',category:'Business',name:'Sales Tax Calculator',description:'Add tax to a pre-tax amount.',fields:[f('amount','Amount',100),f('tax','Tax rate',8,'%')],calculate:v=>[{label:'Tax amount',value:v.amount*v.tax/100},{label:'Total',value:v.amount*(1+v.tax/100)}]},
{slug:'break-even',category:'Business',name:'Break-even Units',description:'Estimate units required to cover fixed costs.',fields:[f('fixed','Fixed costs',1000),f('price','Price per unit',25),f('variable','Variable cost per unit',10)],calculate:v=>one('Break-even units',v.price<=v.variable?0:Math.ceil(v.fixed/(v.price-v.variable)),'units')},
{slug:'hourly-pay',category:'Business',name:'Hourly Pay Calculator',description:'Calculate gross pay from hours and hourly rate.',fields:[f('hours','Hours worked',40,'hours'),f('rate','Hourly rate',20)],calculate:v=>one('Gross pay',v.hours*v.rate)},
{slug:'compound-growth',category:'Business',name:'Compound Growth',description:'Project growth with periodic compounding.',fields:[f('principal','Starting amount',1000),f('rate','Annual rate',5,'%'),f('years','Years',10),f('periods','Compounds per year',12,'',1)],calculate:v=>one('Future value',v.principal*Math.pow(1+v.rate/100/v.periods,v.periods*v.years))},
{slug:'unit-price',category:'Business',name:'Unit Price Comparison',description:'Compare price per unit for a product.',fields:[f('price','Total price',12),f('quantity','Quantity',4)],calculate:v=>one('Price per unit',v.quantity===0?0:v.price/v.quantity)},
{slug:'length-converter',category:'Conversions',name:'Length Converter',description:'Convert metres to feet and inches.',fields:[f('meters','Length',10,'metres')],calculate:v=>[{label:'Feet',value:v.meters*3.28084,unit:'ft'},{label:'Inches',value:v.meters*39.3701,unit:'in'}]},
{slug:'weight-converter',category:'Conversions',name:'Weight Converter',description:'Convert kilograms to pounds and ounces.',fields:[f('kg','Weight',10,'kg')],calculate:v=>[{label:'Pounds',value:v.kg*2.20462,unit:'lb'},{label:'Ounces',value:v.kg*35.274,unit:'oz'}]},
{slug:'temperature',category:'Conversions',name:'Temperature Converter',description:'Convert Celsius to Fahrenheit and Kelvin.',fields:[f('c','Temperature',25,'°C',-273.15,0.1)],calculate:v=>[{label:'Fahrenheit',value:v.c*9/5+32,unit:'°F'},{label:'Kelvin',value:v.c+273.15,unit:'K'}]},
{slug:'data-storage',category:'Technology',name:'Data Storage Converter',description:'Convert megabytes into gigabytes and bytes.',fields:[f('mb','Data size',1024,'MB')],calculate:v=>[{label:'Gigabytes (decimal)',value:v.mb/1000,unit:'GB'},{label:'Bytes',value:v.mb*1_000_000,unit:'bytes'}]},
{slug:'download-time',category:'Technology',name:'Download Time',description:'Estimate download duration from file size and speed.',fields:[f('size','File size',500,'MB'),f('speed','Download speed',50,'Mbps')],calculate:v=>one('Estimated time',v.speed<=0?0:v.size*8/v.speed/60,'minutes')},
{slug:'date-difference',category:'Time',name:'Date Duration',description:'Calculate days represented by a number of weeks and days.',fields:[f('weeks','Weeks',3),f('days','Extra days',2)],calculate:v=>one('Total duration',v.weeks*7+v.days,'days')},
{slug:'time-converter',category:'Time',name:'Time Converter',description:'Convert hours into minutes and seconds.',fields:[f('hours','Hours',2.5,'hours')],calculate:v=>[{label:'Minutes',value:v.hours*60,unit:'min'},{label:'Seconds',value:v.hours*3600,unit:'sec'}]},
{slug:'fuel-cost',category:'Travel',name:'Trip Fuel Cost',description:'Estimate fuel cost for a journey.',fields:[f('distance','Distance',300,'km'),f('efficiency','Fuel use',7,'L/100km'),f('price','Price per litre',1.5)],calculate:v=>one('Estimated fuel cost',v.distance*v.efficiency/100*v.price)},
{slug:'travel-speed',category:'Travel',name:'Average Speed',description:'Calculate average speed from distance and travel time.',fields:[f('distance','Distance',150,'km'),f('hours','Travel time',2,'hours',0.01,0.01)],calculate:v=>one('Average speed',v.hours<=0?0:v.distance/v.hours,'km/h')},
{slug:'paint',category:'Home & Build',name:'Paint Calculator',description:'Estimate paint required for a wall area.',fields:[f('area','Wall area',40,'m²'),f('coverage','Coverage per litre',10,'m²/L'),f('coats','Number of coats',2)],calculate:v=>one('Paint required',v.coverage<=0?0:v.area*v.coats/v.coverage,'litres')},
{slug:'flooring',category:'Home & Build',name:'Flooring Calculator',description:'Estimate flooring material with a waste allowance.',fields:[f('length','Room length',5,'m'),f('width','Room width',4,'m'),f('waste','Extra allowance',10,'%')],calculate:v=>one('Material to buy',v.length*v.width*(1+v.waste/100),'m²')},
{slug:'grade',category:'Education',name:'Grade Percentage',description:'Calculate a score as a percentage.',fields:[f('earned','Points earned',42),f('total','Total points',50)],calculate:v=>one('Grade',v.total<=0?0:v.earned/v.total*100,'%')},
];
export const categories = ['All','Math','Health','Business','Conversions','Technology','Time','Travel','Home & Build','Education'];
export function getCalculator(slug:string){return calculators.find(c=>c.slug===slug);}

/** Validate raw calculator input before running formulas that divide by user values. */
export function isCalculatorInputValid(calculator: CalculatorDefinition, values: Record<string, number>): boolean {
  const fieldsValid = calculator.fields.every((field) => {
    const value = values[field.key];
    return Number.isFinite(value) && value >= (field.min ?? -Infinity);
  });
  if (!fieldsValid) return false;

  // These inputs are divisors or denominators and must be strictly positive.
  const positiveKeys: Record<string, string[]> = {
    'fraction-to-decimal': ['denominator'],
    'pace': ['distance'],
    'download-time': ['speed'],
    'travel-speed': ['hours'],
    'paint': ['coverage'],
    'grade': ['total'],
    'unit-price': ['quantity'],
    'compound-growth': ['periods'],
  };
  return (positiveKeys[calculator.slug] ?? []).every((key) => values[key] > 0);
}
