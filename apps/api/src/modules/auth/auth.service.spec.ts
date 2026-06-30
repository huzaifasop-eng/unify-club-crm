import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
  };
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };

  const rawPassword = 'Password123!';
  let passwordHash: string;

  const baseUser = {
    id: 'user-1',
    email: 'superadmin@unifyclub.org',
    firstName: 'Super',
    lastName: 'Admin',
    avatarUrl: null,
    isActive: true,
    refreshTokenHash: null as string | null,
  };

  const userWithRoles = {
    ...baseUser,
    roles: [
      {
        role: {
          name: 'Super Admin',
          permissions: [{ permission: { resource: 'leads', action: 'manage' } }],
        },
      },
    ],
    branches: [{ branch: { id: 'branch-1', name: 'PECHS' } }],
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(rawPassword, 10);
  });

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed.jwt.token'),
      verifyAsync: jest.fn(),
    };

    authService = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
    );
  });

  describe('login', () => {
    it('throws UnauthorizedException for an unknown email', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.login({ email: 'nobody@unifyclub.org', password: rawPassword }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for a deactivated user', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ ...baseUser, isActive: false, passwordHash });

      await expect(
        authService.login({ email: baseUser.email, password: rawPassword }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ ...baseUser, passwordHash });

      await expect(
        authService.login({ email: baseUser.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('issues tokens and returns a flattened user profile on valid credentials', async () => {
      // First call: lookup by email for credential check.
      prisma.user.findUnique.mockResolvedValueOnce({ ...baseUser, passwordHash });
      // issueTokens() persists the refresh token hash.
      prisma.user.update.mockResolvedValueOnce({});
      // buildUserPayload() re-fetches with roles/branches included.
      prisma.user.findUnique.mockResolvedValueOnce(userWithRoles);

      const result = await authService.login({ email: baseUser.email, password: rawPassword });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.refreshToken).toBe('signed.jwt.token');
      expect(result.user.email).toBe(baseUser.email);
      expect(result.user.roles).toEqual(['Super Admin']);
      expect(result.user.permissions).toEqual(['leads:manage']);
      expect(result.user.isCrossBranch).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: baseUser.id },
          data: expect.objectContaining({ refreshTokenHash: expect.any(String) }),
        }),
      );
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException when the refresh token cannot be verified', async () => {
      jwtService.verifyAsync.mockRejectedValueOnce(new Error('bad token'));

      await expect(authService.refresh('garbage-token')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when the stored hash does not match', async () => {
      jwtService.verifyAsync.mockResolvedValueOnce({ sub: baseUser.id, email: baseUser.email });
      prisma.user.findUnique.mockResolvedValueOnce({
        ...baseUser,
        refreshTokenHash: await bcrypt.hash('a-different-refresh-token', 10),
      });

      await expect(authService.refresh('stale-refresh-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('clears the stored refresh token hash', async () => {
      prisma.user.update.mockResolvedValueOnce({});

      const result = await authService.logout(baseUser.id);

      expect(result).toEqual({ success: true });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: baseUser.id },
        data: { refreshTokenHash: null },
      });
    });
  });
});
