import React from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';

interface SearchResult {
  name: string;
  traits: string[];
  traitDescr: string[];
  scores: number[];
  ranks: number[];
}

const PlotlyPlot = ({ userData }: { userData: SearchResult[] }) => {
    // Define the data for the traces
    const traces: Data[] = userData.map((user) => ({
      type: 'scatterpolar',
      r: user.scores,
      theta: user.traits,
      fill: 'toself',
      name: user.name,
      hovertemplate: `<b>%{customdata[0]} </b> <br>  <span class="traitDescr">%{customdata[3]}</span> <br> <br><b>Score:</b> %{customdata[1]}<br><b>Rank:</b> %{customdata[2]}%<br><b>`,
      text: user.name,
      customdata: user.traits.map((trait, index) => [trait, user.scores[index], user.ranks[index], user.traitDescr[index]]),
    }));

    const traits = userData[0]['traits'];
  
    // Configure the layout
    const layout: Partial<Layout> = {
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 5],
          tickmode: 'linear', // Update the tickmode value here
          tick0: 0,
          dtick: 1,
          tickformat: '.2f',
          title: 'Scores',
        },
        angularaxis: {
          tickmode: 'array',
          tickvals: Array.from({ length: 10 }, (_, i) => i),
          ticktext: userData[0].traits, // Assuming userData has at least one element
          tickangle: 0,
        },
      },
      showlegend: true,
      hovermode: 'closest' as const,
      hoverlabel: {align: 'left'},
    };

    // // CSS style for wrapped hover template
    // const plotStyle: React.CSSProperties = {
    //   width: '700px',
    //   height: '700px',
    // };

    // CSS style for wrapped hover template
    const plotStyle: React.CSSProperties = {
      width: '100%', // Set the initial width to 100%
      height: '700px', // Set the initial height
    };

    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const chartWidth = Math.min(700, windowWidth - 20); // Adjust the maximum chart width as per your requirement
      plotStyle.width = `${chartWidth}px`;
    };

    React.useEffect(() => {
      // Attach resize event listener
      window.addEventListener('resize', handleResize);
      handleResize(); // Call the function once to set the initial width

      return () => {
        // Cleanup the resize event listener
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <Plot
        data={traces}
        layout={layout}
        style={plotStyle}
      />
    );
  };

export default PlotlyPlot;