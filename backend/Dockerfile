FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5133

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["Zenabackend.csproj", "./"]
RUN dotnet restore "Zenabackend.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Zenabackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Zenabackend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Zenabackend.dll"]

