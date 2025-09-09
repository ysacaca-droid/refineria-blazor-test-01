using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace models
{
    // 1 Carretera
    // 2 Fluvial
    // 3 Ferroviaria
    // 4 Ducteo
    public class TransportVehicle
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TransportMethod Method { get; set; } // Campo de la clase original, crucial para el optimizer
        public double TripCapacityM3 { get; set; }
        public double MonthlyCapacityM3 { get; set; }
        public double CostPerKm { get; set; }
        public double CostPerTrip { get; set; } // Campo de la clase original, crucial para el optimizer
        public double AverageSpeedKmH { get; set; }
    }
}

public enum TransportMethod
{
    Carretera,
    Fluvial,
    Ferroviaria,
    Ducteo
}