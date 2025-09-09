using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace models
{
    public class OptimizedTrip
    {
        public string RouteName { get; set; }
        public TransportMethod Method { get; set; }
        public double VolumeAssignedM3 { get; set; }
        public double TripCostUSD { get; set; }
        public double TripTimeHours { get; set; }
        public DateTime ShipmentDate { get; set; }
    }
}
