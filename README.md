# D3-Challenge
## Data Journalism and D3

This task, when done including the Bonus section, represents one of the most complex and intricate works we've been challenged with thus far. 

The need to have multiple sections of the code in snyc and working together to provide the dynamic ploting using D3 proved a mental challenge just to keep track of everything. 

Our course work over the past week provided sufficient guidance to build out the basic template and with a little more research, and a little guessing, the dynamic display came into being. 

With our app.js file being completely blank this time around, I looked to the final d3 activity on hair bands to to establish then tweak some of the boiler plate code used to establish dimensions, margins, and limits. 

The hairband exercise was doing a scatter plot of similar concept but with only a single X axis dynamic input option, no plot circle labeling, and no y-axis dynamic. 

However, having this exercise as a reference helped keep me cognizant of the functions required and where all the refreshes would need to take place whenever a change was introduced.

Because dymanic control is being invoked on both the x and y axis, many of the functions needed to be built separately in support of each axis. 

For example, initial parameters included a chosenXAxis and a choseYAxis. This would continue on down the line for update render and click functions as well as circle group and circle label functions. 

Circle labels was probably the trickiest area as we hadn't discussed it much and, once in place, we still has to incorporate the dynamic updating so the state labels would move in conjuction with the circles upon update or re-rendering of the screen. 

The tool tips was also a bit further complicated by seeking source input from both the x and y axis. It came down to just being another set X and Y axis based tip fillers that needed to be dynamically responsive to user input. 

The bottom and the side labels had to be spaced out through changing their x and y positions in order to not be on top of one another. 

Active/inactive switches are invoked through a series of if then else statements to highlight the selected x or y axis lable selected.

All changes are run through and x an y axis eventlistener function. This is where everything had to be in place and in sync with the other sections of java script. 

It was reward to see everything work in the end. It was tedious undertaking to get there. 

Strong social message regarding the data prsented around healthcare and conditions along with economic status, age, and location. 
