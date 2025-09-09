using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace models
{
    public class Route
    {
        public int Id { get; set; }
        public int StartLocationId { get; set; }
        public int EndLocationId { get; set; }
        public double DistanceInKm { get; set; }
        public double TimeAverage { get; set; } // Tiempo promedio del viaje
    }
}
