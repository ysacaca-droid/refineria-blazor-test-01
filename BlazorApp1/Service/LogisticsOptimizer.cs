using BlazorApp1.Service;
using models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BlazorApp1.Service
{
    //public enum TransportMethod
    //{
    //    Carretera,
    //    Fluvial,
    //    Ferroviaria,
    //    Ducteo
    //}

    public class LogisticsOptimizer
    {
        
        private readonly List<Location> allLocations = new()
        {
            new Location { Id = 1, Name = "Cochabamba", Description = "Refinería G. Villarroel", Active = true },
            new Location { Id = 2, Name = "Santa Cruz", Description = "Refinería G. Elder Bell", Active = true },
            new Location { Id = 3, Name = "La Paz", Description = "Planta de distribución La Paz", Active = true },
            new Location { Id = 4, Name = "Oruro", Description = "Planta de distribución Oruro", Active = true },
            new Location { Id = 5, Name = "Chaco", Description = "Planta de distribución Chaco", Active = true },
            new Location { Id = 6, Name = "Itau", Description = "Planta de distribución Itau", Active = true },
            new Location { Id = 7, Name = "Viru Viru", Description = "Planta de distribución Viru Viru", Active = true }
        };

        private readonly List<TransportVehicle> allVehicles = new()
        {
            new TransportVehicle { Id = 1, Name = "Cisterna", Description = "Camión cisterna", Method = TransportMethod.Carretera, TripCapacityM3 = 30, MonthlyCapacityM3 = 54361, CostPerKm = 0.02, CostPerTrip = 50, AverageSpeedKmH = 60 },
            new TransportVehicle { Id = 2, Name = "Barcaza", Description = "Barcaza fluvial", Method = TransportMethod.Fluvial, TripCapacityM3 = 500, MonthlyCapacityM3 = 6931, CostPerKm = 0.01, CostPerTrip = 200, AverageSpeedKmH = 10 },
            new TransportVehicle { Id = 3, Name = "Vagón de tren", Description = "Vagón de tren", Method = TransportMethod.Ferroviaria, TripCapacityM3 = 80, MonthlyCapacityM3 = 2640, CostPerKm = 0.015, CostPerTrip = 100, AverageSpeedKmH = 25 },
            new TransportVehicle { Id = 4, Name = "Ducto", Description = "Sistema de ductos", Method = TransportMethod.Ducteo, TripCapacityM3 = 300, MonthlyCapacityM3 = 95269, CostPerKm = 0.005, CostPerTrip = 500, AverageSpeedKmH = 50 }
        };

        private readonly List<Route> allRoutes = new()
        {
            new Route { Id = 1, StartLocationId = 1, EndLocationId = 3, DistanceInKm = 360, TimeAverage = 6 }, // Cochabamba a La Paz
            new Route { Id = 2, StartLocationId = 1, EndLocationId = 4, DistanceInKm = 220, TimeAverage = 4 }, // Cochabamba a Oruro
            new Route { Id = 3, StartLocationId = 1, EndLocationId = 5, DistanceInKm = 100, TimeAverage = 2 }, // Cochabamba a Chaco
            new Route { Id = 4, StartLocationId = 2, EndLocationId = 3, DistanceInKm = 900, TimeAverage = 15 }, // Santa Cruz a La Paz
            new Route { Id = 5, StartLocationId = 2, EndLocationId = 6, DistanceInKm = 400, TimeAverage = 7 }, // Santa Cruz a Itau
            new Route { Id = 6, StartLocationId = 2, EndLocationId = 7, DistanceInKm = 15, TimeAverage = 0.5 }  // Santa Cruz a Viru Viru
        };

        public List<OptimizedTrip> GetOptimizedSchedule(
            string startRefineryName,
            string destinationClientName,
            double productQuantityM3)
        {
            var schedule = new List<OptimizedTrip>();
            if (productQuantityM3 <= 0) return schedule;

            // Filtra y ordena las opciones de envío por costo unitario
            var possibleShipments = (from route in allRoutes
                                     join startLocation in allLocations on route.StartLocationId equals startLocation.Id
                                     join endLocation in allLocations on route.EndLocationId equals endLocation.Id
                                     from vehicle in allVehicles
                                     where (startRefineryName == "Todos" || startLocation.Name.Equals(startRefineryName, StringComparison.OrdinalIgnoreCase)) &&
                                           (destinationClientName == "Todos" || endLocation.Name.Equals(destinationClientName, StringComparison.OrdinalIgnoreCase))
                                     select new
                                     {
                                         Route = route,
                                         StartLocation = startLocation,
                                         EndLocation = endLocation,
                                         Vehicle = vehicle,
                                         UnitCostPerM3 = (route.DistanceInKm * vehicle.CostPerKm + vehicle.CostPerTrip) / vehicle.TripCapacityM3
                                     })
                                     .OrderBy(o => o.UnitCostPerM3)
                                     .ToList();

            double remainingQuantity = productQuantityM3;
            DateTime currentDate = DateTime.Today;

            while (remainingQuantity > 0 && possibleShipments.Any())
            {
                // Toma la opción de envío más barata
                var bestOption = possibleShipments.First();

                // Calcula cuántos viajes de este tipo se necesitan para cubrir el 100% de la cantidad restante
                int numberOfTripsNeeded = (int)Math.Ceiling(remainingQuantity / bestOption.Vehicle.TripCapacityM3);

                // Asigna todos los viajes de la opción más barata hasta que la cantidad se cubra o se acabe el inventario
                for (int i = 0; i < numberOfTripsNeeded; i++)
                {
                    if (remainingQuantity <= 0) break;

                    double volumeToAssign = Math.Min(remainingQuantity, bestOption.Vehicle.TripCapacityM3);

                    schedule.Add(new OptimizedTrip
                    {
                        RouteName = $"{bestOption.StartLocation.Name} a {bestOption.EndLocation.Name}",
                        Method = bestOption.Vehicle.Method,
                        VolumeAssignedM3 = volumeToAssign,
                        TripCostUSD = bestOption.UnitCostPerM3 * volumeToAssign,
                        TripTimeHours = bestOption.Route.TimeAverage,
                        ShipmentDate = currentDate
                    });

                    remainingQuantity -= volumeToAssign;

                    // Actualiza la fecha para el próximo envío
                    currentDate = currentDate.AddDays(1); // Simplemente avanza un día por cada envío para un programa claro
                }

                // Remueve la mejor opción para que el bucle siga buscando la siguiente
                possibleShipments.Remove(bestOption);
            }

            return schedule;
        }
    }

    // Mantener la clase OptimizedTrip
    //public class OptimizedTrip
    //{
    //    public string RouteName { get; set; }
    //    public TransportMethod Method { get; set; }
    //    public double VolumeAssignedM3 { get; set; }
    //    public double TripCostUSD { get; set; }
    //    public double TripTimeHours { get; set; }
    //    public DateTime ShipmentDate { get; set; }
    //}
}

//public class Location
//{
//    public int Id { get; set; }
//    public string Name { get; set; }
//    public string Description { get; set; }
//    public bool Active { get; set; }
//}

// Nueva clase para Vehículos de Transporte
//public class TransportVehicle
//{
//    public int Id { get; set; }
//    public string Name { get; set; }
//    public string Description { get; set; }
//    public TransportMethod Method { get; set; } // Campo de la clase original, crucial para el optimizer
//    public double TripCapacityM3 { get; set; }
//    public double MonthlyCapacityM3 { get; set; }
//    public double CostPerKm { get; set; }
//    public double CostPerTrip { get; set; } // Campo de la clase original, crucial para el optimizer
//    public double AverageSpeedKmH { get; set; } // Campo de la clase original, crucial para el optimizer
//}

// Nueva clase principal para las Rutas, que ahora tiene relaciones
//public class Route
//{
//    public int Id { get; set; }
//    public int StartLocationId { get; set; }
//    public int EndLocationId { get; set; }
//    public double DistanceInKm { get; set; }
//    public double TimeAverage { get; set; } // Tiempo promedio del viaje
//}

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