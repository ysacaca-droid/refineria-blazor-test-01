using System;
using System.Collections.Generic;
using System.Linq;

namespace BlazorApp1.Service
{
    public enum TransportMethod
    {
        Carretera,
        Fluvial,
        Ferroviaria,
        Ducteo
    }

    public class Route
    {
        public string Name { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public double DistanceInKm { get; set; }
    }

    public class TransportVehicle
    {
        public string Name { get; set; }
        public TransportMethod Method { get; set; }
        public double CostPerKm { get; set; }
        public double CostPerTrip { get; set; }
        public double TripCapacityM3 { get; set; }
        public double MonthlyCapacityM3 { get; set; }
        public double AverageSpeedKmH { get; set; }
    }

    public class OptimizedTrip
    {
        public string RouteName { get; set; }
        public TransportMethod Method { get; set; }
        public double VolumeAssignedM3 { get; set; }
        public double TripCostUSD { get; set; }
        public double TripTimeHours { get; set; }
        public DateTime ShipmentDate { get; set; }
    }

    public class LogisticsOptimizer
    {
        private readonly List<Route> allRoutes = new List<Route>
        {
            // Rutas desde Cochabamba
            new () { Name = "Cochabamba a La Paz", StartLocation = "Cochabamba", EndLocation = "La Paz", DistanceInKm = 360 },
            new () { Name = "Cochabamba a Oruro", StartLocation = "Cochabamba", EndLocation = "Oruro", DistanceInKm = 220 },
            new () { Name = "Cochabamba a Chaco", StartLocation = "Cochabamba", EndLocation = "Chaco", DistanceInKm = 100 },
            // Rutas desde Santa Cruz
            new () { Name = "Santa Cruz a La Paz", StartLocation = "Santa Cruz", EndLocation = "La Paz", DistanceInKm = 900 },
            new () { Name = "Santa Cruz a Itau", StartLocation = "Santa Cruz", EndLocation = "Itau", DistanceInKm = 400 },
            new () { Name = "Santa Cruz a Viru Viru", StartLocation = "Santa Cruz", EndLocation = "Viru Viru", DistanceInKm = 15 }
        };

        private readonly List<TransportVehicle> allVehicles = new List<TransportVehicle>
        {
            new TransportVehicle { Name = "Cisterna", Method = TransportMethod.Carretera, TripCapacityM3 = 30, MonthlyCapacityM3 = 54361, CostPerKm = 0.02, CostPerTrip = 50, AverageSpeedKmH = 60 },
            new TransportVehicle { Name = "Barcaza", Method = TransportMethod.Fluvial, TripCapacityM3 = 500, MonthlyCapacityM3 = 6931, CostPerKm = 0.01, CostPerTrip = 200, AverageSpeedKmH = 10 },
            new TransportVehicle { Name = "Vagón de tren", Method = TransportMethod.Ferroviaria, TripCapacityM3 = 80, MonthlyCapacityM3 = 2640, CostPerKm = 0.015, CostPerTrip = 100, AverageSpeedKmH = 25 },
            new TransportVehicle { Name = "Ducto", Method = TransportMethod.Ducteo, TripCapacityM3 = 300, MonthlyCapacityM3 = 95269, CostPerKm = 0.005, CostPerTrip = 500, AverageSpeedKmH = 50 }
        };

        public List<OptimizedTrip> GetOptimizedSchedule(
            string startRefineryName,
            string destinationClientName,
            double productQuantityM3)
        {
            var schedule = new List<OptimizedTrip>();
            if (productQuantityM3 <= 0) return schedule;

            // 1. Unir rutas y vehículos, calcular el costo unitario (Costo por m³) y ordenar por el más barato

            var asdahsjkdh = (from route in allRoutes from vehicle in allVehicles select new { Route = route, Vehicle = vehicle});

            var allPossibleOptions = (from route in allRoutes
                                      from vehicle in allVehicles
                                      where (startRefineryName == "Todos" || route.StartLocation.Equals(startRefineryName, StringComparison.OrdinalIgnoreCase)) &&
                                            (destinationClientName == "Todos" || route.EndLocation.Equals(destinationClientName, StringComparison.OrdinalIgnoreCase))
                                      select new
                                      {
                                          Route = route,
                                          Vehicle = vehicle,
                                          // Calculamos el costo por metro cúbico para una comparación justa.
                                          UnitCostPerM3 = (route.DistanceInKm * vehicle.CostPerKm + vehicle.CostPerTrip) / vehicle.TripCapacityM3
                                      }).OrderBy(o => o.UnitCostPerM3).ToList();

            double remainingQuantity = productQuantityM3;
            double daysElapsed = 0;

            // 2. Iterar sobre las opciones ordenadas y asignar el volumen.
            foreach (var option in allPossibleOptions)
            {
                if (remainingQuantity <= 0) break; // Si ya no hay producto, detener.

                double volumeToAssign = Math.Min(remainingQuantity, option.Vehicle.TripCapacityM3);

                schedule.Add(new OptimizedTrip
                {
                    RouteName = option.Route.Name,
                    Method = option.Vehicle.Method,
                    VolumeAssignedM3 = volumeToAssign,
                    TripCostUSD = option.UnitCostPerM3 * volumeToAssign,
                    TripTimeHours = option.Route.DistanceInKm / option.Vehicle.AverageSpeedKmH,
                    ShipmentDate = DateTime.Today.AddDays(daysElapsed)
                });

                remainingQuantity -= volumeToAssign;
                daysElapsed += (option.Route.DistanceInKm / option.Vehicle.AverageSpeedKmH) / 24;
            }

            return schedule;
        }
    }
}

//using System;
//using System.Collections.Generic;
//using System.Linq;

//namespace BlazorApp1.Service
//{
//    public enum TransportMethod
//    {
//        Carretera,
//        Fluvial,
//        Ferroviaria,
//        Ducteo
//    }

//    public class Route
//    {
//        public string Name { get; set; }
//        public string StartLocation { get; set; }
//        public string EndLocation { get; set; }
//        public double DistanceInKm { get; set; }
//    }

//    public class TransportVehicle
//    {
//        public string Name { get; set; }
//        public TransportMethod Method { get; set; }
//        public double CostPerKm { get; set; }
//        public double CostPerTrip { get; set; }
//        public double TripCapacityM3 { get; set; }
//        public double MonthlyCapacityM3 { get; set; }
//        public double AverageSpeedKmH { get; set; }
//    }

//    public class OptimizedTrip
//    {
//        public string RouteName { get; set; }
//        public TransportMethod Method { get; set; }
//        public double VolumeAssignedM3 { get; set; }
//        public double TripCostUSD { get; set; }
//        public double TripTimeHours { get; set; }
//        public DateTime ShipmentDate { get; set; }
//    }

//    public class LogisticsOptimizer
//    {
//        private readonly List<Route> allRoutes = new List<Route>
//        {
//            // Rutas desde Cochabamba
//            new () { Name = "Cochabamba a La Paz", StartLocation = "Cochabamba", EndLocation = "La Paz", DistanceInKm = 360 },
//            new () { Name = "Cochabamba a Oruro", StartLocation = "Cochabamba", EndLocation = "Oruro", DistanceInKm = 220 },
//            new () { Name = "Cochabamba a Chaco", StartLocation = "Cochabamba", EndLocation = "Chaco", DistanceInKm = 100 },
//            // Rutas desde Santa Cruz
//            new () { Name = "Santa Cruz a La Paz", StartLocation = "Santa Cruz", EndLocation = "La Paz", DistanceInKm = 900 },
//            new () { Name = "Santa Cruz a Itau", StartLocation = "Santa Cruz", EndLocation = "Itau", DistanceInKm = 400 },
//            new () { Name = "Santa Cruz a Viru Viru", StartLocation = "Santa Cruz", EndLocation = "Viru Viru", DistanceInKm = 15 }
//        };

//        private readonly List<TransportVehicle> allVehicles = new List<TransportVehicle>
//        {
//            new TransportVehicle { Name = "Cisterna", Method = TransportMethod.Carretera, TripCapacityM3 = 30, MonthlyCapacityM3 = 54361, CostPerKm = 0.02, CostPerTrip = 50, AverageSpeedKmH = 60 },
//            new TransportVehicle { Name = "Barcaza", Method = TransportMethod.Fluvial, TripCapacityM3 = 500, MonthlyCapacityM3 = 6931, CostPerKm = 0.01, CostPerTrip = 200, AverageSpeedKmH = 10 },
//            new TransportVehicle { Name = "Vagón de tren", Method = TransportMethod.Ferroviaria, TripCapacityM3 = 80, MonthlyCapacityM3 = 2640, CostPerKm = 0.015, CostPerTrip = 100, AverageSpeedKmH = 25 },
//            new TransportVehicle { Name = "Ducto", Method = TransportMethod.Ducteo, TripCapacityM3 = 300, MonthlyCapacityM3 = 95269, CostPerKm = 0.005, CostPerTrip = 500, AverageSpeedKmH = 50 }
//        };

//        public List<OptimizedTrip> GetOptimizedSchedule(
//            string startRefineryName,
//            string destinationClientName,
//            double productQuantityM3)
//        {
//            var schedule = new List<OptimizedTrip>();
//            if (productQuantityM3 <= 0) return schedule;

//            var possibleShipments = (from route in allRoutes
//                                     from vehicle in allVehicles
//                                     where (startRefineryName == "Todos" || route.StartLocation.Equals(startRefineryName, StringComparison.OrdinalIgnoreCase)) &&
//                                           (destinationClientName == "Todos" || route.EndLocation.Equals(destinationClientName, StringComparison.OrdinalIgnoreCase))
//                                     select new
//                                     {
//                                         Route = route,
//                                         Vehicle = vehicle,
//                                         TotalTripCost = (route.DistanceInKm * vehicle.CostPerKm) + vehicle.CostPerTrip,
//                                         TotalTripTime = route.DistanceInKm / vehicle.AverageSpeedKmH
//                                     }).OrderBy(s => s.TotalTripCost).ToList();

//            double remainingQuantity = productQuantityM3;
//            double daysElapsed = 0;

//            while (remainingQuantity > 0 && possibleShipments.Any())
//            {
//                var bestOption = possibleShipments.First();
//                double volumeToSend = Math.Min(remainingQuantity, bestOption.Vehicle.TripCapacityM3);

//                schedule.Add(new OptimizedTrip
//                {
//                    RouteName = bestOption.Route.Name,
//                    Method = bestOption.Vehicle.Method,
//                    VolumeAssignedM3 = volumeToSend,
//                    TripCostUSD = bestOption.TotalTripCost,
//                    TripTimeHours = bestOption.TotalTripTime,
//                    ShipmentDate = DateTime.Today.AddDays(daysElapsed)
//                });

//                remainingQuantity -= volumeToSend;
//                daysElapsed += bestOption.TotalTripTime / 24;
//            }

//            return schedule;
//        }
//    }
//}