import sys
import random
import pygame

# Initialize pygame
pygame.init()

# Window settings
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 600
screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
pygame.display.set_caption("太空捕手")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
YELLOW = (255, 255, 0)

# Settings
PLAYER_SIZE = 50
PLAYER_SPEED = 5
BILL_WIDTH = 100
BILL_HEIGHT = 50
COIN_SPEED = 4

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Create an image (surface) for the player
        self.image = pygame.Surface((PLAYER_SIZE, PLAYER_SIZE))
        self.image.fill(WHITE)
        
        # Get the rect and set initial position
        self.rect = self.image.get_rect()
        self.rect.centerx = WINDOW_WIDTH // 2
        self.rect.bottom = WINDOW_HEIGHT - 10

    def update(self):
        # Key handling within the sprint
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= PLAYER_SPEED
        if keys[pygame.K_RIGHT]:
            self.rect.x += PLAYER_SPEED

        # Boundary checks
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > WINDOW_WIDTH:
            self.rect.right = WINDOW_WIDTH

class Coin(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Load and scale the 1000 NTD bill imagex   
        try:
            image = pygame.image.load("1000_ntd.png").convert_alpha()
            self.image = pygame.transform.scale(image, (BILL_WIDTH, BILL_HEIGHT))
        except FileNotFoundError:
            # Fallback if image not found: Draw a green rectangle
            self.image = pygame.Surface((BILL_WIDTH, BILL_HEIGHT))
            self.image.fill((0, 255, 0))  # Green for money
            
        # Get the rect and set initial random position
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, WINDOW_WIDTH - BILL_WIDTH)
        self.rect.y = -BILL_HEIGHT # Start just above the screen

    def update(self):
        self.rect.y += COIN_SPEED
        # Note: We handle the "killing" and scoring logic in the main loop 
        # to simplify accessing the score variable.

def main():
    # Groups
    all_sprites = pygame.sprite.Group()
    coins = pygame.sprite.Group()

    # Create Player
    player = Player()
    all_sprites.add(player)

    # Score settings
    score = 0
    font = pygame.font.Font(None, 36)

    # Clock
    clock = pygame.time.Clock()
    
    running = True
    while running:
        # Event handling
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Spawn coins
        if random.randint(1, 60) == 1:
            coin = Coin()
            all_sprites.add(coin)
            coins.add(coin)

        # Update all sprites
        all_sprites.update()

        # Check for missed coins (out of bounds)
        for coin in coins:
            if coin.rect.top > WINDOW_HEIGHT:
                score -= 5
                coin.kill()

        # Collision detection (Player vs Coins)
        # spritecollide returns a list of sprites from 'coins' that collided with 'player'
        # True means remove the coin sprite from all groups
        hits = pygame.sprite.spritecollide(player, coins, True)
        for hit in hits:
            score += 10
        
        # Drawing
        screen.fill(BLACK)
        all_sprites.draw(screen)

        # Draw Score
        score_text = font.render(f"Score: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))

        # Update display
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
