using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace models
{
    public class MapperRouteData
    {
        public int Id { get; set; }
        public int TransportVehicleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<double[]> Routes { get; set; }
        public string Color { get; set; }
        public int LineThickness { get; set; }
        public bool IsDotted { get; set; }
    }
}
