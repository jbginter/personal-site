#!/bin/bash

# Docker Development Helper Script
# Quick commands for common Docker development tasks

set -e

PROJECT_NAME="portfolio-site"
COMPOSE_FILE="docker-compose.dev.yml"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Docker Development Helper${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

case "$1" in
    "start")
        print_header
        print_info "Starting development environment..."
        docker-compose -f $COMPOSE_FILE up
        ;;
    
    "start-bg")
        print_header
        print_info "Starting development environment in background..."
        docker-compose -f $COMPOSE_FILE up -d
        print_success "Services started!"
        print_info "View logs with: ./docker-dev.sh logs"
        ;;
    
    "stop")
        print_header
        print_info "Stopping development environment..."
        docker-compose -f $COMPOSE_FILE down
        print_success "Services stopped!"
        ;;
    
    "restart")
        print_header
        print_info "Restarting development environment..."
        docker-compose -f $COMPOSE_FILE restart
        print_success "Services restarted!"
        ;;
    
    "logs")
        print_header
        print_info "Showing logs (Ctrl+C to exit)..."
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    
    "logs-app")
        print_header
        print_info "Showing app logs (Ctrl+C to exit)..."
        docker-compose -f $COMPOSE_FILE logs -f app
        ;;
    
    "logs-db")
        print_header
        print_info "Showing database logs (Ctrl+C to exit)..."
        docker-compose -f $COMPOSE_FILE logs -f postgres
        ;;
    
    "init-db")
        print_header
        print_info "Initializing database..."
        docker-compose -f $COMPOSE_FILE exec app npx prisma db push
        print_success "Database schema created!"
        
        print_info "Seeding database with sample data..."
        docker-compose -f $COMPOSE_FILE exec app npx prisma db seed
        print_success "Database seeded!"
        ;;
    
    "studio")
        print_header
        print_info "Starting Prisma Studio..."
        print_info "Access at: http://localhost:5555"
        docker-compose -f $COMPOSE_FILE --profile tools up prisma-studio
        ;;
    
    "shell")
        print_header
        print_info "Opening shell in app container..."
        docker-compose -f $COMPOSE_FILE exec app sh
        ;;
    
    "psql")
        print_header
        print_info "Opening PostgreSQL shell..."
        docker-compose -f $COMPOSE_FILE exec postgres psql -U postgres -d chatroom_db
        ;;
    
    "reset-db")
        print_header
        print_warning "This will delete all data in the database!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Resetting database..."
            docker-compose -f $COMPOSE_FILE exec app npx prisma migrate reset --force
            print_success "Database reset complete!"
        else
            print_info "Cancelled"
        fi
        ;;
    
    "clean")
        print_header
        print_warning "This will remove all containers, volumes, and data!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Cleaning up..."
            docker-compose -f $COMPOSE_FILE down -v
            print_success "Cleanup complete!"
        else
            print_info "Cancelled"
        fi
        ;;
    
    "rebuild")
        print_header
        print_info "Rebuilding containers..."
        docker-compose -f $COMPOSE_FILE build --no-cache
        print_success "Rebuild complete!"
        print_info "Start with: ./docker-dev.sh start"
        ;;
    
    "install")
        print_header
        if [ -z "$2" ]; then
            print_error "Please specify package name"
            echo "Usage: ./docker-dev.sh install <package-name>"
            exit 1
        fi
        print_info "Installing $2..."
        docker-compose -f $COMPOSE_FILE exec app npm install "$2"
        print_success "Package installed!"
        print_info "Restarting app..."
        docker-compose -f $COMPOSE_FILE restart app
        ;;
    
    "status")
        print_header
        print_info "Service status:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    
    "help"|"")
        print_header
        echo "Usage: ./docker-dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start          Start development environment (foreground)"
        echo "  start-bg       Start development environment (background)"
        echo "  stop           Stop development environment"
        echo "  restart        Restart all services"
        echo ""
        echo "  logs           Show all logs"
        echo "  logs-app       Show app logs only"
        echo "  logs-db        Show database logs only"
        echo ""
        echo "  init-db        Initialize database (first time setup)"
        echo "  reset-db       Reset database (deletes all data)"
        echo "  studio         Open Prisma Studio (database GUI)"
        echo ""
        echo "  shell          Open shell in app container"
        echo "  psql           Open PostgreSQL shell"
        echo ""
        echo "  install PKG    Install npm package"
        echo "  rebuild        Rebuild all containers"
        echo "  clean          Remove all containers and volumes"
        echo "  status         Show service status"
        echo ""
        echo "  help           Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./docker-dev.sh start-bg"
        echo "  ./docker-dev.sh init-db"
        echo "  ./docker-dev.sh install axios"
        echo "  ./docker-dev.sh logs-app"
        ;;
    
    *)
        print_error "Unknown command: $1"
        echo "Run './docker-dev.sh help' for usage information"
        exit 1
        ;;
esac
